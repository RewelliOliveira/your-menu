import { LogoYourMenu } from "@/app/assets/IconsFull";
import { DropMenu } from "@/app/assets/IconsAdm";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/app/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/DropdownMenu";

export interface HeaderProps {
  isAdmin?: boolean;
}

export function Header({ isAdmin = true }: HeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <header className="flex w-full items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shadow-xs">
      <div
        className="cursor-pointer"
        onClick={() => navigate(isAdmin ? "/adm/orders" : "/")}
      >
        <LogoYourMenu className="w-36 md:w-44 h-auto" />
      </div>

      {isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Menu administrativo"
              className="p-1 text-gray-700 hover:text-orange-600 transition-colors cursor-pointer focus:outline-none"
            >
              <DropMenu className="w-8 h-8" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Painel do Restaurante</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/adm/orders")}>
                Pedidos em tempo real
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/adm/edit-menu")}>
                Gerenciar Cardápio
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/adm/add-order")}>
                Adicionar Prato
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/adm/profile-restaurant")}>
                Perfil & Horários
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/adm/restaurant-adress")}>
                Configurações de Endereço
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/adm/restaurant-delivery")}>
                Taxas & Zonas de Entrega
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate("/adm");
              }}
              className="text-red-600 focus:text-red-700 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair da conta</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
