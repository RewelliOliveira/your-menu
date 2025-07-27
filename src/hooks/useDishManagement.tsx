import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getSizeOptionsApi, SizeOptionApi } from '@/services/size-opition-api';
import { getCategoriesApi, CategoryApi, createCategoryApi } from '@/services/category-api';
import { DishSizeOption } from '@/services/create-dish';

type SelectOption = {
  label: string;
  value: string;
};

export function useDishManagement(token: string, restaurantId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [sizeOptions, setSizeOptions] = useState<SelectOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSizeId, setSelectedSizeId] = useState('');
  const [price, setPrice] = useState('');
  const [sizeOptionsPrices, setSizeOptionsPrices] = useState<DishSizeOption[]>([]);

  useEffect(() => {
    async function fetchInitialData() {
      if (!token || !restaurantId) return;

      setIsLoading(true);
      try {
        await Promise.all([fetchSizeOptions(), fetchCategories()]);
      } catch {
        toast.error('Erro ao carregar dados iniciais');
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialData();
  }, [token, restaurantId]);

  async function fetchSizeOptions() {
    try {
      const data: SizeOptionApi[] = await getSizeOptionsApi(token);
      const options = data.map((size) => ({
        label: `${size.magnitude ?? ''} ${size.abbreviation}`.trim(),
        value: size.id.toString(),
      }));
      setSizeOptions(options);
    } catch (error) {
      toast.error('Erro ao carregar opções de tamanho');
    }
  }

  async function fetchCategories() {
    try {
      const data: CategoryApi[] = await getCategoriesApi(restaurantId, token);
      const options = data.map((cat) => ({
        label: cat.name,
        value: cat.Id.toString(),
      }));
      setCategoryOptions(options);
    } catch {
      toast.error('Erro ao carregar categorias');
    }
  }

  async function addNewCategory(categoryName: string) {
    if (!categoryName.trim()) return;

    try {
      setIsLoading(true);
      const newCategory = await createCategoryApi(restaurantId, categoryName, token);

      // Atualiza a lista de categorias
      await fetchCategories();

      // Seleciona automaticamente a nova categoria
      setSelectedCategoryId(newCategory.Id.toString());

      toast.success('Categoria adicionada com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao adicionar categoria');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddSizeOptionPrice() {
    if (!selectedSizeId || !price) {
      toast.warn('Selecione um tamanho e informe o preço');
      return;
    }

    const sizeOptionIdNum = Number(selectedSizeId);

    const priceNum = parseFloat(price.replace(',', '.'));

    if (isNaN(priceNum)) {
      toast.warn('Informe um preço válido');
      return;
    }

    if (sizeOptionsPrices.some((item) => item.sizeOptionId === sizeOptionIdNum)) {
      toast.warn('Esse tamanho já foi adicionado');
      return;
    }

    const newEntry: DishSizeOption = {
      sizeOptionId: sizeOptionIdNum,
      price: priceNum,
    };

    setSizeOptionsPrices((old) => [...old, newEntry]);
    setSelectedSizeId('');
    setPrice('');
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
    addNewCategory, // Nova função exportada
  };
}