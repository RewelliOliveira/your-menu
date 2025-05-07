import { ArrowLeft } from "@/assets/icons-adm";
import { DiaSemanaCombobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { HorarioFuncionamento } from "@/features/system-adm/components/ui/horario";
import { UploadLogo } from "@/features/system-adm/components/ui/upload-logo";

export function PerfilRestaurante() {
  return (
    <div className="min-h-screen bg-white">
      <header className="relative flex items-center justify-center py-4 bg-orange-600 text-white">
        <ArrowLeft className="absolute left-4 text-white" />
        <h1 className="text-xl font-semibold">Perfil</h1>
      </header>

      <div className="w-full px-4 sm:px-6 md:px-8 max-w-md mx-auto mt-10 flex flex-col gap-6">
        <UploadLogo />
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 max-w-md mx-auto mt-10">
        <h2 className="text-black font-bold text-left mb-2">
          Nome do restaurante
        </h2>
        <Input type="text" placeholder="Nome do restaurante" className="mb-4" />
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 max-w-md mx-auto mt-10">
        <h2 className="text-black font-bold text-left mb-2">
          Período de funcionamento
        </h2>
        <div className="flex flex-row items-center justify-between gap-2">
          <DiaSemanaCombobox />
          <span className="text-black">à</span>
          <DiaSemanaCombobox />
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 max-w-md mx-auto mt-10">
        <h2 className="text-black font-bold text-left mb-2">
          Horário de funcionamento
        </h2>
        <HorarioFuncionamento />
      </div>
    </div>
  );
}
