import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { deleteDishApi } from "@/services/create-dish";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { ConfirmModal } from "./ui/confirm-modal";

export type SizeOption = {
  size: string;
  price: string;
};

export type OrderProps = {
  id: number | string;
  sizeOptions?: SizeOption[];
  name: string;
  description: string;
  price: string;
  foodImg: string;
  status: string;
  restaurantId: string;
  categoryId: number;
};

interface MenuItemProps extends OrderProps {
  onClick?: (produto: OrderProps) => void;
  onDelete?: (dishId: number, categoryId: number) => void;
  token: string;
}

export function MenuItem(order: MenuItemProps) {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/adm/edit-order/${order.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDishApi(
        order.restaurantId,
        order.categoryId,
        Number(order.id),
        order.token
      );
      toast.success("Prato excluído com sucesso!");
      window.location.reload();
    } catch {
      toast.error("Erro ao excluir prato. Por favor, tente novamente.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div
        className="flex flex-col bg-white w-55 h-auto m-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
        onClick={() => order.onClick?.(order)}
      >
        <img
          src={order.foodImg || "placeholder.svg"}
          alt={order.name || "Imagem do prato"}
          className="w-full h-24 object-cover rounded-t-lg"
        />

        <div className="p-3 flex flex-col flex-1">
          <h2 className="font-bold text-base">{order.name || "Nome do prato"}</h2>
          <p className="text-xs text-gray-500 break-words overflow-hidden">
            {order.description || "Descrição do prato"}
          </p>

          <p className="font-semibold mt-2">R${order.price || "--,--"}</p>

          <div className="flex justify-end mt-auto">
            <button
              onClick={handleDeleteClick}
              type="button"
              aria-label="Remover prato"
              className="group bg-white shadow-lg w-8 h-8 flex items-center justify-center transition-all duration-300 rounded hover:w-16 hover:bg-red-600/80"
            >
              <Icon
                icon="solar:trash-bin-trash-bold"
                className="w-5 h-5 text-red-500 transition-colors duration-300 group-hover:text-white"
              />
            </button>
            <button
              onClick={handleEditClick}
              type="button"
              aria-label="Editar prato"
              className="group bg-white shadow-lg w-8 h-8 flex items-center justify-center transition-all duration-300 rounded hover:w-16 hover:bg-blue-600/80"
            >
              <Icon
                icon="solar:pen-2-outline"
                className="w-5 h-5 text-gray-500 transition-colors duration-300 group-hover:text-white"
              />
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <ConfirmModal
          title="Confirmar exclusão"
          content={`Tem certeza que deseja excluir o prato "${order.name}"?`}
          buttonmsg="Confirmar"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}