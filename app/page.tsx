import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex gap-4">
        <Button className="text-lg">
          <Link href="/create-game">Criar Sala</Link>
        </Button>
        <Button className="text-lg">
          <Link href="/enter-game">Entrar na sala</Link>
        </Button>
      </div>
  </div>
  );
}
