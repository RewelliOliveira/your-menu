import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MenuItemAdd() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/adm/add-order")}
      className="flex flex-col bg-white w-full max-w-[240px] h-72 rounded-2xl shadow-sm border border-dashed border-gray-300 transition-all duration-300 hover:shadow-md hover:border-green-500 hover:scale-[1.02] cursor-pointer group p-4"
    >
      <div className="w-full h-32 bg-gray-50 flex items-center justify-center rounded-xl border border-gray-100 group-hover:bg-green-50/50 transition-colors">
        <Plus className="w-10 h-10 text-gray-400 group-hover:text-green-600 transition-colors" />
      </div>
      <div className="flex flex-col flex-1 justify-between pt-4">
        <div>
          <h2 className="font-bold text-base text-gray-800 group-hover:text-green-600 transition-colors">
            Adicionar novo prato
          </h2>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Cadastre novos sabores, combos ou bebidas no seu cardápio.
          </p>
        </div>
        <div className="flex justify-end pt-2">
          <span className="text-xs font-semibold text-green-600 group-hover:underline">
            Criar prato →
          </span>
        </div>
      </div>
    </div>
  );
}
