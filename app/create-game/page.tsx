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
        <div className="flex items-center justify-center h-screen">
          <form className="grid grid-cols-2 gap-2 content-center" onSubmit={onsubmit}>
            <Input
                type="text"
                placeholder="Nome da Sala"
            />
            <Button
              type="submit"
              className="text-lg"
            >
              Criar
            </Button>
          </form>
        </div>
      );
}
