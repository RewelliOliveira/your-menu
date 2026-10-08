import { useEffect, useState } from "react";
import { Header } from "@/app/components/layout/Header";
import { MenuItemAdm } from "../components/MenuItemAdm";
import { MenuItemAdd } from "../components/MenuItemAdd";
import { Banner } from "@/app/components/layout/Banner";
import { TabbedSections } from "@/app/components/layout/TabbedSections";
import { getPratosPorCategoria, deleteDishApi } from "@/infrastructure/services/dish-service";
import { getCategoriesApi, deleteCategoryApi } from "@/infrastructure/services/category-service";
import { useAuth } from "@/app/hooks/use-auth";
import { toast } from "react-toastify";
import { ProductModal, ProductModalData } from "../components/ProductModal";
import { ConfirmModal } from "@/app/components/ui/ConfirmModal";
import { Dish } from "@/core/types/dish-types";

interface CategoriaComPratos {
  id: number;
  name: string;
  pratos: Dish[];
}

export function EditMenuPage() {
  const [categorias, setCategorias] = useState<CategoriaComPratos[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductModalData | null>(null);
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState<CategoriaComPratos | null>(null);
  const { token, restaurantId } = useAuth();

  const handleDeleteDish = async (dishId: number, categoryId: number) => {
    if (!token || !restaurantId) return;

    try {
      await deleteDishApi(restaurantId, categoryId, dishId, token);
      setCategorias((prev) =>
        prev.map((categoria) => ({
          ...categoria,
          pratos: categoria.pratos.filter((prato) => prato.id !== dishId),
        }))
      );
      toast.success("Prato excluído com sucesso!");
    } catch {
      toast.error("Erro ao excluir prato");
    }
  };

  const handleDeleteCategory = (categoryName: string) => {
    const categoria = categorias.find((c) => c.name === categoryName);
    if (!categoria) return;
    setCategoriaParaExcluir(categoria);
  };

  const confirmDeleteCategory = async () => {
    if (!token || !restaurantId || !categoriaParaExcluir) return;

    try {
      await deleteCategoryApi(restaurantId, categoriaParaExcluir.id, token);
      setCategorias((prev) => prev.filter((c) => c.id !== categoriaParaExcluir.id));
      toast.success("Categoria excluída com sucesso!");
    } catch {
      toast.error("Erro ao excluir categoria");
    } finally {
      setCategoriaParaExcluir(null);
    }
  };

  useEffect(() => {
    async function carregarCardapio() {
      if (!token || !restaurantId) return;

      setCarregando(true);

      try {
        const categoriasAPI = await getCategoriesApi(restaurantId, token);

        const categoriasComPratos = await Promise.all(
          categoriasAPI.map(async (categoria) => {
            try {
              const pratosAPI = await getPratosPorCategoria(
                restaurantId,
                categoria.id,
                token
              );
              return {
                id: categoria.id,
                name: categoria.name,
                pratos: pratosAPI,
              };
            } catch {
              return {
                id: categoria.id,
                name: categoria.name,
                pratos: [],
              };
            }
          })
        );

        setCategorias(categoriasComPratos);
      } catch {
        toast.error("Falha ao carregar categorias");
      } finally {
        setCarregando(false);
      }
    }

    carregarCardapio();
  }, [token, restaurantId]);

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f5f5f5]">
        <div className="text-base font-medium text-gray-600">Carregando cardápio...</div>
      </div>
    );
  }

  const pratosComCategoria = categorias.flatMap((categoria) =>
    categoria.pratos.map((prato) => ({
      ...prato,
      categoryName: categoria.name,
    }))
  );

  const ordemCategorias = categorias.map((c) => c.name);

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-16">
      <Header isAdmin={true} />
      <Banner isAdmin={true} />

      <TabbedSections
        title="Gerenciamento de Cardápio"
        data={pratosComCategoria}
        getCategory={(item) => item.categoryName}
        categoriesOrder={ordemCategorias}
        renderItem={(item) => {
          const menorPreco = item.sizeOptionsPrices?.length
            ? Math.min(...item.sizeOptionsPrices.map((op) => op.price))
            : 0;

          return (
            <MenuItemAdm
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={menorPreco.toFixed(2)}
              foodImg={item.imgUrl}
              status={item.categoryName}
              restaurantId={restaurantId || ""}
              categoryId={item.categoryId}
              token={token || ""}
              onClick={() =>
                setSelectedProduct({
                  name: item.name,
                  description: item.description,
                  foodImg: item.imgUrl,
                  sizeOptions: item.sizeOptionsPrices?.map((s) => ({
                    size: s.measureUnit,
                    price: s.price.toFixed(2),
                  })),
                })
              }
              onDelete={(dishId, catId) => handleDeleteDish(dishId, catId)}
            />
          );
        }}
        renderAfterItems={() => <MenuItemAdd />}
        onDeleteCategory={handleDeleteCategory}
      />

      {selectedProduct && (
        <ProductModal
          produto={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {categoriaParaExcluir && (
        <ConfirmModal
          title="Excluir categoria"
          content={`Tem certeza que deseja excluir a categoria "${categoriaParaExcluir.name}" e seus itens?`}
          buttonmsg="Excluir Categoria"
          confirmVariant="danger"
          onConfirm={confirmDeleteCategory}
          onCancel={() => setCategoriaParaExcluir(null)}
        />
      )}
    </div>
  );
}
