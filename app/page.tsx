import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex gap-4">
        <Button className="text-lg">Criar Sala</Button>
        <Button className="text-lg">Entrar na sala</Button>
      </div>
  </div>
  );
}
