"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { Client, Message } from "@stomp/stompjs";

export default function PlayerRoom() {
  const [roomSession, setRoomSession] = useState("");
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [stompClient, setStompClient] = useState<Client>();
  const [gameData, setGameData] = useState<ResponseData>();

  const router = useRouter();
  const pathName = usePathname();
  const sessionCode: string | undefined = pathName.split("/").pop();

  const letterMappings: Record<string, number[]> = {
    B: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    I: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    N: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    G: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
    O: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75],
  };

  const initializeStompClient = () => {
    const client = new Client({
      brokerURL: `${process.env.NEXT_PUBLIC_WS_URL}/bingo-connect`, // Change to your Spring Boot WebSocket URL
      debug: (str) => {
        console.log(str);
      },
    });

    client.onConnect = (frame) => {
      console.info("StompJS connected:", frame);
      subscribeToDestination(client);
      setStompClient(client); // Store the Stomp client instance in state
    };

    client.onStompError = (frame) => {
      console.error("StompJS error:", frame);
    };

    client.onWebSocketClose = () => {
      console.log("WebSocket connection closed");
    };

    client.activate();
  };

  useEffect(() => {
    axios
      .get<ResponseData>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/room/${sessionCode}`
      )
      .then((response) => {
        if (response.status !== 200) {
          alert("Sala não encontrada");
          router.push("/enter-game");
        } else {
          const roomSettings: ResponseData = response.data;
          setGameData(roomSettings);
          setRoomSession(roomSettings.sessionCode);
          console.log(drawnNumbers);

          localStorage.setItem("roomSettings", JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        alert("Sala não encontrada");
        router.push("/enter-game");
      });
  }, []);

  useEffect(() => {
    initializeStompClient();
  }, [roomSession]);

  useEffect(() => {
    if (gameData) {
      const drawnNumbersAsList = gameData.drawnNumbers.split(",").map(Number);
      setDrawnNumbers(drawnNumbersAsList);
    }
  }, [gameData]);

  const searchForLetterOfNumber = (number: number) => {
    for (const letter in letterMappings) {
      if (letterMappings[letter].includes(number)) {
        return letter;
      }
    }
  };

  const subscribeToDestination = (client: Client) => {
    client.subscribe(`/room/${roomSession}`, (message: Message) => {
      const responseData: ResponseData = JSON.parse(message.body);
      setGameData(responseData);
    });
  };

  const drawnNumbersForLetterBInCrescentOrder = drawnNumbers
    .filter((number) => number <= 15)
    .sort((a, b) => a - b);
  const drawnNumbersForLetterIInCrescentOrder = drawnNumbers
    .filter((number) => number > 15 && number <= 30)
    .sort((a, b) => a - b);
  const drawnNumbersForLetterNInCrescentOrder = drawnNumbers
    .filter((number) => number > 30 && number <= 45)
    .sort((a, b) => a - b);
  const drawnNumbersForLetterGInCrescentOrder = drawnNumbers
    .filter((number) => number > 45 && number <= 60)
    .sort((a, b) => a - b);
  const drawnNumbersForLetterOInCrescentOrder = drawnNumbers
    .filter((number) => number > 60)
    .sort((a, b) => a - b);

  return (
    <>
      <div className="flex items-center justify-center mt-20">
        <div className="w-[60vw] h-[60vw] rounded-full bg-white shadow-xl flex items-center justify-center">
          <h2 className="text-4xl font-bold text-gray-900">
            {drawnNumbers.length > 0 && (
              <p>
                {searchForLetterOfNumber(
                  drawnNumbers[drawnNumbers.length - 1]
                )}{" "}
                - {drawnNumbers[drawnNumbers.length - 1].toFixed(0).padStart(2, "0") }
              </p>
            )}
          </h2>
        </div>
      </div>

      <div className="border border-gray-300 shadow-lg p-4 mt-4 bg-slate-100">
        <h2 className="text-lg font-bold mb-2 flex justify-center">
          Número anterior
        </h2>
        <div className="flex justify-center">
          <div className="bg-blue-700 text-slate-100 font-bold py-2 px-4 rounded border border-gray-200 mr-2">
            { drawnNumbers.length > 1 &&

            <h2> {searchForLetterOfNumber(drawnNumbers[drawnNumbers.length - 2])} - {drawnNumbers[drawnNumbers.length - 2].toFixed(0).padStart(2, "0")}</h2>
            
            }
            
          </div>
        </div>
      </div>

      {drawnNumbers.length ? (
        <div className="border border-gray-300 shadow-lg p-4 mt-4 bg-slate-100">
          <h2 className="text-lg font-bold mb-2 flex justify-center">
            Números sorteados
          </h2>
          <div className="">
            <label className="flex bg-blue-700 rounded-md px-5 py-2 text-slate-100 font-bold">
              B - {drawnNumbersForLetterBInCrescentOrder.join(", ")}
            </label>
            <br />
            <label className="flex bg-blue-700 rounded-md px-5 py-2 text-slate-100 font-bold">
              I - {drawnNumbersForLetterIInCrescentOrder.join(", ")}
            </label>
            <br />
            <label className="flex bg-blue-700 rounded-md px-5 py-2 text-slate-100 font-bold">
              N - {drawnNumbersForLetterNInCrescentOrder.join(", ")}
            </label>
            <br />
            <label className="flex bg-blue-700 rounded-md px-5 py-2 text-slate-100 font-bold">
              G - {drawnNumbersForLetterGInCrescentOrder.join(", ")}
            </label>
            <br />
            <label className="flex bg-blue-700 rounded-md px-5 py-2 text-slate-100 font-bold">
              O - {drawnNumbersForLetterOInCrescentOrder.join(", ")}
            </label>
          </div>
        </div>
      ) : null}
    </>
  );
}
