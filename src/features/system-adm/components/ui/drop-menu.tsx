import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DropMenu } from "@/assets/icons-adm";

export function DropdownMenuDemo() {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button><DropMenu className="w-8" /></button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Opções</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/cardapio")}>
            Cardápio
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/orders")}>
            Pedidos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/profile-restaurante")}>
            Configurar perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/endereco")}>
            Configurações de endereço
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/entrega")}>
            Configurações de entrega
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/historico")}>
            Histórico de pedidos
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
