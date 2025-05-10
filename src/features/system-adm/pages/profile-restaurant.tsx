import { ArrowLeft } from "@/assets/icons-adm";
import { Input } from "@/components/ui/input";
import { LongButton } from "../components/ui/button-long";
import { TimerPicker } from "@/features/system-adm/components/ui/timer-picker";
import { UploadLogo } from "@/features/system-adm/components/ui/upload-logo";
import { SelectDay } from "../components/ui/select-day";

export function PerfilRestaurante() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <header className="w-full flex items-center justify-center py-4 bg-orange-600 text-white fixed top-0 z-10">
        <ArrowLeft className="absolute left-4 text-white" />
        <h1 className="text-xl font-semibold">Perfil</h1>
      </header>

      <main className="w-full max-w-md mt-16 mb-24 px-4 space-y-6">
        <UploadLogo />

        <div>
          <h2 className="text-black font-bold text-left mb-2">Nome do restaurante</h2>
          <Input type="text" placeholder="Nome do restaurante" />
        </div>

        <div>
          <h2 className="text-black font-bold text-left mb-2">Período de funcionamento</h2>
          <div className="flex items-center justify-between">
            <SelectDay />
            <span className="text-black px-2">-</span>
            <SelectDay />
          </div>
        </div>

        <div>
          <h2 className="text-black font-bold text-left mb-2">Horário de funcionamento</h2>
          <TimerPicker />
        </div>

        <div>
          <h2 className="text-black font-bold text-left mb-2">Tempo estimado de entrega</h2>
          <Input type="text" placeholder="entre 1hr - 2hr" />
        </div>
      </main>

      <footer className="w-full bg-white border-t border-gray-200 fixed bottom-0 py-4">
        <div className="max-w-md w-full px-4 mx-auto">
          <LongButton type="submit">Salvar informações</LongButton>
        </div>
      </footer>
    </div>
  );
}