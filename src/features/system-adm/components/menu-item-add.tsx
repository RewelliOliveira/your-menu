import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MenuItemAdd() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/adm/add-order")}
      className="flex flex-col bg-white w-55 h-60 m-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer group"
    >
      <div className="w-full h-24 bg-gray-100 flex items-center justify-center rounded-t-lg border-b border-gray-100">
        <Plus className="w-8 h-8 text-gray-400 group-hover:text-[#00b37e] transition-colors" />
      </div>
      <div className="p-3 flex flex-col flex-1">
        <div className="flex flex-col flex-1">
          <h2 className="font-bold text-base text-gray-800">Novo prato</h2>
          <p className="text-xs text-gray-500 break-words mt-1">
            Clique aqui para adicionar um prato
          </p>
        </div>
        <div className="flex justify-center mt-auto p-2">
          <button
            type="button"
            aria-label="Adicionar prato"
            className="group/btn bg-[#00b37e] shadow-lg w-8 h-8 flex items-center justify-center transition-all duration-300 rounded hover:bg-[#00b37e]/80 hover:w-16"
          >
            <Plus className="w-5 h-5 text-white transition-colors duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
