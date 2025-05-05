import { ArrowLeft } from "@/assets/icons-adm";

export function PerfilRestaurante() {
  return (
    <div>
      <header className="relative flex items-center justify-center py-4 bg-CinzaYourMenu">
        <ArrowLeft className="absolute left-4 text-gray-700" />
        <h1 className="text-xl font-semibold text-gray-800">Perfil</h1>
      </header>
    </div>
  );
}
