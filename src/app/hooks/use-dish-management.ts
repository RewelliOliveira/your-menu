import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { getSizeOptionsApi } from "@/infrastructure/services/dish-service";
import { getCategoriesApi, createCategoryApi } from "@/infrastructure/services/category-service";
import { DishSizeInput } from "@/core/types/dish-types";
import { parseCurrencyToNumber } from "@/core/utils/utils";

export interface SelectOption {
  label: string;
  value: string;
}

export function useDishManagement(token: string, restaurantId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [sizeOptions, setSizeOptions] = useState<SelectOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [price, setPrice] = useState("");
  const [sizeOptionsPrices, setSizeOptionsPrices] = useState<DishSizeInput[]>([]);

  const fetchSizeOptions = useCallback(async () => {
    try {
      const data = await getSizeOptionsApi(token);
      const options = data.map((size) => ({
        label: `${size.magnitude ?? ""} ${size.abbreviation}`.trim(),
        value: size.id.toString(),
      }));
      setSizeOptions(options);
    } catch {
      toast.error("Erro ao carregar opções de tamanho");
    }
  }, [token]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategoriesApi(restaurantId, token);
      const options = data.map((cat) => ({
        label: cat.name,
        value: cat.id.toString(),
      }));
      setCategoryOptions(options);
    } catch {
      toast.error("Erro ao carregar categorias");
    }
  }, [restaurantId, token]);

  useEffect(() => {
    async function fetchInitialData() {
      if (!token || !restaurantId) return;

      setIsLoading(true);
      try {
        await Promise.all([fetchSizeOptions(), fetchCategories()]);
      } catch {
        toast.error("Erro ao carregar dados iniciais");
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialData();
  }, [token, restaurantId, fetchSizeOptions, fetchCategories]);

  async function addNewCategory(categoryName: string): Promise<boolean> {
    if (!categoryName.trim()) return false;

    try {
      setIsLoading(true);
      const newCategory = await createCategoryApi(restaurantId, categoryName, token);
      await fetchCategories();
      setSelectedCategoryId(newCategory.id.toString());
      toast.success("Categoria adicionada com sucesso!");
      return true;
    } catch {
      toast.error("Erro ao adicionar categoria");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddSizeOptionPrice() {
    if (!selectedSizeId || !price) {
      toast.warn("Selecione um tamanho e informe o preço");
      return;
    }

    const sizeOptionIdNum = Number(selectedSizeId);
    const priceNum = parseCurrencyToNumber(price);

    if (isNaN(priceNum) || priceNum <= 0) {
      toast.warn("Informe um preço válido maior que zero");
      return;
    }

    if (sizeOptionsPrices.some((item) => item.sizeOptionId === sizeOptionIdNum)) {
      toast.warn("Esse tamanho já foi adicionado");
      return;
    }

    const newEntry: DishSizeInput = {
      sizeOptionId: sizeOptionIdNum,
      price: priceNum,
    };

    setSizeOptionsPrices((old) => [...old, newEntry]);
    setSelectedSizeId("");
    setPrice("");
  }

  return {
    isLoading,
    sizeOptions,
    categoryOptions,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSizeId,
    setSelectedSizeId,
    price,
    setPrice,
    sizeOptionsPrices,
    setSizeOptionsPrices,
    handleAddSizeOptionPrice,
    fetchSizeOptions,
    fetchCategories,
    addNewCategory,
  };
}
