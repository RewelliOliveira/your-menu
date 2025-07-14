import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MenuItemAdd() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col bg-white w-55 h-60 m-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <img
        src="placeholder.svg"
        alt=""
        className="w-full h-24 object-cover rounded-t-lg"
      />
      <div className="p-3 flex flex-col flex-1">
        <div className="flex flex-col flex-1">
          <h2 className="font-bold text-base">{"Novo prato"}</h2>
          <p className="text-xs text-gray-500 break-words">
            {"Clique aqui para adicionar um prato"}
          </p>
        </div>
        <div className="flex justify-center mt-auto p-2">
          <button
            onClick={() => console.log(navigate("/add-order"))}
            type="button"
            aria-label="Adicionar prato"
            className="group bg-[#00b37e] shadow-lg w-8 h-8 flex items-center justify-center transition-all duration-300 rounded hover:bg-[#00b37e]/80 hover:w-16"
          >
            <Plus className="w-5 h-5 text-white transition-colors duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
