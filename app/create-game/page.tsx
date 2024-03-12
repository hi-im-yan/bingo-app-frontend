"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent } from "react";

export default function ProfileForm() {
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        console.log(event.currentTarget)
        const formData = new FormData(event.currentTarget)
        // const response = await fetch('/api/submit', {
        //   method: 'POST',
        //   body: formData,
        // })
     
        // Handle response if necessary
        // const data = await response.json()
        // ...
      }

    return (
        <>
          <div className="flex justify-between h-screen items-center">
            <div className="flex flex-row m-auto p-4 shadow-lg border rounded bg-cyan-100">
              <Input 
                className="border-1 mr-4 hover:border-slate-700 shadow-sm focus:border-cyan-500"
                placeholder="Nome da sala"
              />
              <Button className="bg-cyan-500">
                Confirmar
              </Button>
            </div>
          </div>
        </>
      );
}
