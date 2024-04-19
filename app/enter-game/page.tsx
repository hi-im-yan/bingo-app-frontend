"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";


export default function EnterGamePage() {
  const [roomSession, setRoomSession] = useState("");
  const router = useRouter();

  async function redirectToGameRoom() {
    if (roomSession === "" || roomSession === null) {
      return;
    }
    router.push(`/game/room/${roomSession}`);
  }

  return (
    <>
      <div className="flex justify-between h-screen items-center">
        <div className="flex flex-row m-auto p-4 shadow-lg border rounded bg-cyan-100">
          <Input
            className="border-1 mr-4 hover:border-slate-700 shadow-sm focus:border-cyan-500"
            placeholder="Código da sala"
            value={roomSession}
            onChange={(e) => setRoomSession(e.target.value)}
          />
          <Button className="bg-cyan-500" onClick={redirectToGameRoom}>
            Confirmar
          </Button>
        </div>
      </div>
    </>
  );
}
