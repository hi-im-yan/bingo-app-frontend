"use client";

import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";

export default function ProfileForm() {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [selectedLetterNumber, setSelectedLetterNumber] = useState("");


  const handleButtonClick = (letter: string) => {
    setSelectedLetter(letter);
  };

  const letterMappings: Record<string, number[]> = {
    B: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    I: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    N: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    G: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
    O: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75],
  };

  let drawnNumbers: number[] = [
    1, 5, 48, 74
  ];

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
              onClick={() => handleButtonClick(letter)}
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
                onClick={() => setSelectedLetterNumber(selectedLetter + number)}
                className={`bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded border border-gray-200 mb-1 hover:bg-gray-300 ${
                  drawnNumbers.includes(number) ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={drawnNumbers.includes(number)}
              >
                {number.toFixed(0).padStart(2, "0")}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div>{selectedLetterNumber}</div>
    </>
  );
}
