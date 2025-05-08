import { ArrowLeft } from "@/assets/icons-adm";
import { Input } from "@/components/ui/input";
import { TimerPicker } from "@/features/system-adm/components/ui/timer-picker";
import { UploadLogo } from "@/features/system-adm/components/ui/upload-logo";
import { SelectDay } from "../components/ui/select-day";

export function PerfilRestaurante() {
  return (
    <div className="min-h-screen">
      <header className="w-screen flex items-center justify-center py-4 bg-orange-600 text-white">
        <ArrowLeft className="absolute left-4 text-white" />
        <h1 className="text-xl font-semibold">Perfil</h1>
      </header>

      <main className="flex flex-col gap-10">
        <UploadLogo />
        <div className="w-full px-4 max-w-md mx-auto">
          <h2 className="text-black font-bold text-left mb-2">
            Nome do restaurante
          </h2>
          <Input type="text" placeholder="Nome do restaurante" className="mb-4" />
        </div>

        <div className="w-full px-4 max-w-md mx-auto">
          <h2 className="text-black font-bold text-left mb-2">
            Período de funcionamento
          </h2>
          <div className="flex flex-row items-center justify-between">
            <SelectDay />
            <span className="text-black px-2">-</span>
            <SelectDay />
          </div>
        </div>

        <div className="w-full px-4 max-w-md mx-auto">
          <h2 className="text-black font-bold text-left mb-2">
            Horário de funcionamento
          </h2>
          <TimerPicker />
        </div>

        <div className="w-full px-4 max-w-md mx-auto">
          <h2 className="text-black font-bold text-left mb-2">
            Tempo estimado de entrega
          </h2>
          <Input type="text" placeholder="entre 1hr - 2hr" className="mb-4" />
        </div>
      </main>
      <footer >
        
      </footer>
    </div>
  );
}
