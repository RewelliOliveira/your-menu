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
          <DropdownMenuItem onClick={() => navigate("/adm/edit-menu")}>
            Cardápio
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/adm/orders")}>
            Pedidos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/adm/profile-restaurant")}>
            Configurar perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/adm/restaurant-adress")}>
            Configurações de endereço
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/adm/restaurant-delivery")}>
            Configurações de entrega
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/adm/historico")}>
            Histórico de pedidos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/adm/add-order")}>
            Adicionar prato
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/adm/");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
