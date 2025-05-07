import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function HorarioFuncionamento() {
  return (
    <div className="w-full max-w-md px-4 flex flex-col gap-4">
      <div className="flex flex-nowrap gap-4 items-end">
        <div className="flex flex-col flex-1 min-w-0">
          <Label htmlFor="abertura">Abertura</Label>
          <Input id="abertura" type="time" className="w-full" />
        </div>
        <span className="text-black">às</span>
        <div className="flex flex-col flex-1 min-w-0">
          <Label htmlFor="fechamento">Fechamento</Label>
          <Input id="fechamento" type="time" className="w-full" />
        </div>
      </div>
    </div>
  );
}
