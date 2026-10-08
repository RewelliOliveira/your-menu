import { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { deleteDishApi } from "@/infrastructure/services/dish-service";
import { toast } from "react-toastify";
import { ConfirmModal } from "@/app/components/ui/ConfirmModal";
import { formatCurrencySimple } from "@/core/utils/utils";

export interface MenuItemAdmProps {
  id: number | string;
  name: string;
  description: string;
  price: string;
  foodImg: string;
  status: string;
  restaurantId: string;
  categoryId: number;
  token?: string;
  onClick?: () => void;
  onDelete?: (dishId: number, categoryId: number) => void;
}

export function MenuItemAdm({
  id,
  name,
  description,
  price,
  foodImg,
  restaurantId,
  categoryId,
  token = "",
  onClick,
  onDelete,
}: MenuItemAdmProps) {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/adm/edit-order/${id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (onDelete) {
        onDelete(Number(id), categoryId);
      } else {
        await deleteDishApi(restaurantId, categoryId, Number(id), token);
        toast.success("Prato excluído com sucesso!");
      }
    } catch {
      toast.error("Erro ao excluir prato. Tente novamente.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div
        className="flex flex-col bg-white w-full max-w-[240px] h-72 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer overflow-hidden p-3"
        onClick={onClick}
      >
        <div className="w-full h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={foodImg || "/placeholder.svg"}
            alt={name || "Imagem do prato"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col flex-1 justify-between pt-2">
          <div>
            <h3 className="font-bold text-base text-gray-900 truncate">{name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <span className="font-bold text-sm text-gray-900">
              R$ {typeof price === "number" ? formatCurrencySimple(price) : price}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleDeleteClick}
                type="button"
                aria-label={`Excluir ${name}`}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                title="Excluir prato"
              >
                <Icon icon="solar:trash-bin-trash-bold" className="w-4 h-4" />
              </button>
              <button
                onClick={handleEditClick}
                type="button"
                aria-label={`Editar ${name}`}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                title="Editar prato"
              >
                <Icon icon="solar:pen-2-outline" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <ConfirmModal
          title="Confirmar exclusão"
          content={`Tem certeza que deseja excluir permanentemente o prato "${name}"?`}
          buttonmsg="Excluir"
          confirmVariant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
