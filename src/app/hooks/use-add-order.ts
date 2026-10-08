import { useState } from "react";
import { createCategoryApi } from "@/infrastructure/services/category-service";
import { toast } from "react-toastify";

export interface CategoryOption {
  label: string;
  value: string;
}

export function useAddOrder(restaurantId: string, token: string) {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleToggleAvailable = () => {
    setIsAvailable((prev) => !prev);
  };

  const handleAddCategory = async () => {
    const trimmedCategory = newCategory.trim();
    const alreadyExists = categories.some(
      (c) => c.label.toLowerCase() === trimmedCategory.toLowerCase()
    );

    if (!token || !restaurantId) {
      toast.error("Usuário não autenticado ou restaurante não definido.");
      return;
    }

    if (trimmedCategory && !alreadyExists) {
      try {
        await createCategoryApi(restaurantId, trimmedCategory, token);

        setCategories((prev) => [
          ...prev,
          {
            label: trimmedCategory,
            value: trimmedCategory.toLowerCase().replace(/\s+/g, "-"),
          },
        ]);

        setNewCategory("");
        setShowInput(false);
        toast.success("Categoria adicionada com sucesso!");
      } catch {
        toast.error("Erro ao adicionar categoria. Tente novamente.");
      }
    } else if (alreadyExists) {
      toast.error("Categoria já existente.");
    } else {
      toast.error("Nome da categoria não pode ser vazio.");
    }
  };

  return {
    itemName,
    setItemName,
    itemDescription,
    setItemDescription,
    isAvailable,
    handleToggleAvailable,
    categories,
    setCategories,
    newCategory,
    setNewCategory,
    showInput,
    setShowInput,
    handleAddCategory,
  };
}
