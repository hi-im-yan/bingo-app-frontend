"use client"

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
    // await fetch('https://dummyjson.com/products/add', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     title: roomName,
    //     /* other product data */
    //   })
    // })
    //   .then(res => res.json())
    //   .then((data) => {
    //     console.log(data);
    //     router.push('/')
    //   });
  }

  return (
    <>
    <h1>Game Admin page</h1>
    </>
  );
}
