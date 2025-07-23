import { useState } from "react";
import { createCategoryApi } from "@/services/category-api";
import { toast } from "react-toastify";

export function useAddOrder(restaurantId: string, token: string) {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
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
        window.location.reload();
      } catch (err) {
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
