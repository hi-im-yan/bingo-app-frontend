"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

function toSockJsUrl(url: string): string {
	return url.replace(/^wss:/, "https:").replace(/^ws:/, "http:");
}

const WS_URL = toSockJsUrl(
	process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:8080/bingo-connect",
);

interface UseStompClientOptions {
	onConnect?: () => void;
	onDisconnect?: () => void;
	onError?: (error: string) => void;
	reconnectDelay?: number;
}

interface UseStompClientReturn {
	connected: boolean;
	subscribe: (destination: string, callback: (message: IMessage) => void) => (() => void) | undefined;
	publish: (destination: string, body: string) => void;
}

export function useStompClient(options: UseStompClientOptions = {}): UseStompClientReturn {
	const { onConnect, onDisconnect, onError, reconnectDelay = 5000 } = options;
	const [connected, setConnected] = useState(false);
	const clientRef = useRef<Client | null>(null);
	const callbacksRef = useRef({ onConnect, onDisconnect, onError });

	callbacksRef.current = { onConnect, onDisconnect, onError };

	useEffect(() => {
		const client = new Client({
			webSocketFactory: () => new SockJS(WS_URL),
			reconnectDelay,
			onConnect: () => {
				setConnected(true);
				callbacksRef.current.onConnect?.();
			},
			onDisconnect: () => {
				setConnected(false);
				callbacksRef.current.onDisconnect?.();
			},
			onStompError: (frame) => {
				const message = frame.headers?.message ?? "STOMP error";
				callbacksRef.current.onError?.(message);
			},
			onWebSocketError: () => {
				callbacksRef.current.onError?.("WebSocket connection failed");
			},
		});

		client.activate();
		clientRef.current = client;

		return () => {
			client.deactivate();
			clientRef.current = null;
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

	return { connected, subscribe, publish };
}
