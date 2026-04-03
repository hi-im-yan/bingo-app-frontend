"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

function toSockJsUrl(url: string): string {
	return url.replace(/^wss:/, "https:").replace(/^ws:/, "http:");
}

const WS_BASE = toSockJsUrl(
	process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:8080",
);
const WS_URL = `${WS_BASE.replace(/\/$/, "")}/bingo-connect`;

export interface WsErrorResponse {
	status: number;
	code: string;
	message: string;
}

interface UseStompClientOptions {
	onConnect?: () => void;
	onDisconnect?: () => void;
	onError?: (error: string) => void;
	onServerError?: (error: WsErrorResponse) => void;
	onReconnect?: () => void;
	reconnectDelay?: number;
}

interface UseStompClientReturn {
	connected: boolean;
	reconnecting: boolean;
	subscribe: (destination: string, callback: (message: IMessage) => void) => (() => void) | undefined;
	publish: (destination: string, body: string) => void;
}

export function useStompClient(options: UseStompClientOptions = {}): UseStompClientReturn {
	const { onConnect, onDisconnect, onError, onServerError, onReconnect, reconnectDelay = 5000 } = options;
	const [connected, setConnected] = useState(false);
	const [reconnecting, setReconnecting] = useState(false);
	const clientRef = useRef<Client | null>(null);
	const wasConnectedRef = useRef(false);
	const callbacksRef = useRef({ onConnect, onDisconnect, onError, onServerError, onReconnect });

	callbacksRef.current = { onConnect, onDisconnect, onError, onServerError, onReconnect };

	useEffect(() => {
		const client = new Client({
			webSocketFactory: () => {
			const sock = new SockJS(WS_URL);
			// Disable credentials to avoid CORS preflight issues
			(sock as unknown as { withCredentials: boolean }).withCredentials = false;
			return sock;
		},
			reconnectDelay,
			heartbeatIncoming: 10000,
			heartbeatOutgoing: 10000,
			onConnect: () => {
				// Subscribe to personal error queue immediately
				client.subscribe("/user/queue/errors", (message) => {
					try {
						const error: WsErrorResponse = JSON.parse(message.body);
						callbacksRef.current.onServerError?.(error);
					} catch {
						callbacksRef.current.onError?.("Failed to parse server error");
					}
				});

				const wasReconnect = wasConnectedRef.current;
				setConnected(true);
				setReconnecting(false);
				wasConnectedRef.current = true;
				if (wasReconnect) {
					callbacksRef.current.onReconnect?.();
				}
				callbacksRef.current.onConnect?.();
			},
			onDisconnect: () => {
				setConnected(false);
				if (wasConnectedRef.current) {
					setReconnecting(true);
				}
				callbacksRef.current.onDisconnect?.();
			},
			onStompError: (frame) => {
				const message = frame.headers?.message ?? "STOMP error";
				callbacksRef.current.onError?.(message);
			},
			onWebSocketError: () => {
				setConnected(false);
				if (wasConnectedRef.current) {
					setReconnecting(true);
				}
				callbacksRef.current.onError?.("WebSocket connection failed");
			},
			onWebSocketClose: () => {
				setConnected(false);
				if (wasConnectedRef.current) {
					setReconnecting(true);
				}
			},
		});

		client.activate();
		clientRef.current = client;

		return () => {
			client.deactivate();
			clientRef.current = null;
			wasConnectedRef.current = false;
			setReconnecting(false);
		};
	}, [reconnectDelay]);

	const subscribe = useCallback(
		(destination: string, callback: (message: IMessage) => void) => {
			const client = clientRef.current;
			if (!client?.connected) return undefined;

			const subscription = client.subscribe(destination, callback);
			return () => subscription.unsubscribe();
		},
		[],
	);

	const publish = useCallback((destination: string, body: string) => {
		const client = clientRef.current;
		if (!client?.connected) return;

		client.publish({ destination, body });
	}, []);

	return { connected, reconnecting, subscribe, publish };
}
