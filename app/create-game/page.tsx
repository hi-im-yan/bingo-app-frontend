"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";

export default function ProfileForm() {
  const [ isLoading, setIsLoading ] = useState(false);
  const router = useRouter();

  const formSchema = z.object({
    roomName: z.string().min(1, {
      message: "Nome da sala é obrigatório",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    axios
      .post<ResponseData>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/room`, {
        name: values.roomName,
        description: "DEFAULT DESCRIPTION",
        password: "DEFAULT PASSWORD",
      })
      .then((response) => {
        if (response.status !== 200) {
          alert(response);
        } else {
          localStorage.setItem("roomSettings", JSON.stringify(response.data));
          router.push("/game/admin");
        }
        setIsLoading(false);
      });
  }

  return (
    <>
      <div className="flex justify-between h-screen items-center">
        <Form {...form}>
          <div className="flex flex-row m-auto p-4 shadow-lg border rounded bg-cyan-100">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="roomName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da sala</FormLabel>
                    <FormControl>
                      <Input placeholder="Bingo da Turma" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isLoading ? (
                <Button disabled><Spinner className="text-green-400"></Spinner></Button>
              ) : (
                <Button type="submit">Criar</Button>
              )}
            </form>
          </div>
        </Form>
      </div>
    </>
  );
}
