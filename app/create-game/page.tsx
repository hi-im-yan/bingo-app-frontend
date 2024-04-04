"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";


export default function ProfileForm() {
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  async function createRoom() {
    axios
      .post<ResponseData>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/room`, {
        name: roomName,
        description: 'DEFAULT DESCRIPTION',
        password: 'DEFAULT PASSWORD'
      })
      .then((response) => {
        if (response.status !== 200) {
          alert(response);
        } else {
          localStorage.setItem("roomSettings", JSON.stringify(response.data));
          router.push("/game/admin");
        }
      });
  }

  return (
    <>
      <div className="flex justify-between h-screen items-center">
        <div className="flex flex-row m-auto p-4 shadow-lg border rounded bg-cyan-100">
          <Input
            className="border-1 mr-4 hover:border-slate-700 shadow-sm focus:border-cyan-500"
            placeholder="Nome da sala"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <Button className="bg-cyan-500" onClick={createRoom}>
            Confirmar
          </Button>
        </div>
      </div>
    </>
  );
}
