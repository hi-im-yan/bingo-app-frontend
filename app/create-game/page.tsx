"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ProfileForm() {
  const [roomName, setRoomName] = useState('');
  const router = useRouter()

  async function createRoom() {
    await fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: roomName,
        /* other product data */
      })
    })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        router.push('/')
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
            onChange={e => setRoomName(e.target.value)}
          />
          <Button className="bg-cyan-500" onClick={createRoom}>
            Confirmar
          </Button>
        </div>
      </div>
    </>
  );
}
