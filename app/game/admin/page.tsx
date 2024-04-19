"use client";

import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Client, Message } from "@stomp/stompjs";

export default function ProfileForm() {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [selectedNumber, setSelectedNumber] = useState(-1);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [stompClient, setStompClient] = useState<Client>();
  const [gameData, setGameData] = useState<ResponseData>();
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);

  const localStorageData = localStorage.getItem("roomSettings");

  // Parse the JSON string into a TypeScript object of type MyObject
  const roomSettings: ResponseData | null = localStorageData
    ? JSON.parse(localStorageData)
    : null;

  // Function to initialize the Stomp client and establish the connection
  const initializeStompClient = () => {
    const client = new Client({
      brokerURL: `${process.env.NEXT_PUBLIC_WS_URL}/bingo-connect`, // Change to your Spring Boot WebSocket URL
      debug: (str) => {
        console.log(str);
      },
    });

    client.onConnect = (frame) => {
      console.info('StompJS connected:', frame);
      subscribeToDestination(client)
      setStompClient(client); // Store the Stomp client instance in state
    };

    client.onStompError = (frame) => {
      console.error('StompJS error:', frame);
    };

    client.onWebSocketClose = () => {
      console.log('WebSocket connection closed');
    };

    client.activate();
  };

  const publishNumber = () => {
    if (stompClient) {
      stompClient.publish({
        destination: `/app/add-number`,
        body: JSON.stringify({
          "session-code":  `${roomSettings?.sessionCode}`,
          "creator-hash": `${roomSettings?.creatorHash}`,
          "number": selectedNumber,
      }),
      });
    } else {
      console.error('Stomp client is not initialized');
    }
  };

  const subscribeToDestination = (client: Client) => {
    client.subscribe(`/room/${roomSettings?.sessionCode}`, (message: Message) => {
      const responseData: ResponseData = JSON.parse(message.body);
      setGameData(responseData);
    });
  };

  // Initialize the Stomp client when the component mounts
  useEffect(() => {
    initializeStompClient();
  }, []);

  useEffect(() => { 
    if (gameData) {
      const drawnNumbersAsList = gameData.drawnNumbers.split(",").map(Number);
      setDrawnNumbers(drawnNumbersAsList);
    }
  }, [gameData]);



  const handleConfirmButtonClick = () => {
    setDialogOpen(true);
  };

  const handleModalClose = () => {
    setDialogOpen(false);
  };

  const handleChosenLetter = (letter: string) => {
    setSelectedLetter(letter);
    setSelectedNumber(-1);
  };

  const handleNumberSubmit = () => {
    console.log("submitting number", selectedLetter + selectedNumber);
    setDialogOpen(false);
  };

  const letterMappings: Record<string, number[]> = {
    B: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    I: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    N: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    G: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
    O: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75],
  };

  return (
    <>
      <div className="border border-gray-300 shadow-lg p-4 lg:w-1/4 sm:w-max">
        <div className="grid grid-cols-5">
          {["B", "I", "N", "G", "O"].map((letter) => (
            <Button
              key={letter}
              className={`bg-${
                selectedLetter.match(letter) ? "blue-700" : "blue-500"
              } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border border-gray-200 m-1`}
              onClick={() => handleChosenLetter(letter)}
            >
              {letter}
            </Button>
          ))}
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-5">
          {letterMappings[selectedLetter]?.map((number, index) => (
            <div key={index}>
              <Button
                onClick={() => setSelectedNumber(number)}
                className={`bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded border border-gray-200 mb-1 hover:bg-gray-300 ${
                  drawnNumbers.includes(number)
                    ? "cursor-not-allowed opacity-50"
                    : ""
                } ${
                  selectedNumber === number
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-700"
                    : ""
                }`}
                disabled={drawnNumbers.includes(number)}
              >
                {number.toFixed(0).padStart(2, "0")}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Dialog>
        {selectedNumber === -1 ? (
          <Button
            onClick={() => setDialogOpen(true)}
            className={`bg-green-500 hover:bg-green-700 text-white font-bold mt-5 cursor-not-allowed opacity-50 w-full`}
          >
            Selecione uma letra e um número
          </Button>
        ) : (
          <DialogTrigger asChild>
            <Button
              onClick={() => setDialogOpen(true)}
              className={`bg-green-500 hover:bg-green-700 text-white font-bold mt-5 w-full`}
            >
              Confirmar: {selectedLetter + selectedNumber}
            </Button>
          </DialogTrigger>
        )}

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Confirmar número {selectedLetter + selectedNumber}
            </DialogTitle>
            <DialogDescription>
              Ao confirmar, todos os jogadores serão notificados.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" onClick={() => publishNumber()}>
                Confirmar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
