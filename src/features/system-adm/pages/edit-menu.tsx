import { useEffect, useState } from "react";
import { Header } from "../components/header";
import { MenuItem, OrderProps } from "../components/menu-item";
import { MenuItemAdd } from "../components/menu-item-add";
import { Banner } from "../components/ui/banner";
import { TabbedSections } from "../components/ui/tabbed-sections";
import { getPratosPorCategoria } from "@/services/create-dish";
import { getCategoriesApi } from "@/services/category-api";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "react-toastify";
import { ProductModal } from "../components/Product-modal"
import { deleteDishApi } from "@/services/create-dish";

interface CategoriaComPratos {
  id: number;
  name: string;
  pratos: OrderProps[];
}

export function EditMenu() {
  const [categorias, setCategorias] = useState<CategoriaComPratos[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<OrderProps | null>(null);

  const { token, restaurantId } = useAuth();

  const handleDeleteDish = async (dishId: number, categoryId: number) => {
    if (!token || !restaurantId) return;

    try {
      await deleteDishApi(restaurantId, categoryId, dishId, token);
      setCategorias(prev => prev.map(categoria => ({
        ...categoria,
        pratos: categoria.pratos.filter(prato => prato.id !== dishId.toString())
      })));
      toast.success("Prato excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir prato");
      console.error(error);
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
                categoria.Id,
                token
              );

              const pratosFormatados: OrderProps[] = pratosAPI.map((prato) => {
                const urlConvertida = prato.imgUrl
                  ? prato.imgUrl.replace(
                    "s3://upload-images-teste-1/",
                    "https://upload-images-teste-1.s3.sa-east-1.amazonaws.com/"
                  )
                  : "https://via.placeholder.com/150";

                const menorPreco = prato.sizeOptionsPrices?.length
                  ? Math.min(...prato.sizeOptionsPrices.map((op) => op.price))
                  : 0;

                return {
                  id: prato.id.toString(),
                  name: prato.name,
                  description: prato.description,
                  price: menorPreco.toFixed(2),
                  foodImg: urlConvertida,
                  status: categoria.name,
                  isAvailable: prato.isAvailable,
                  restaurantId: restaurantId,
                  categoryId: categoria.Id,
                  sizeOptions: prato.sizeOptionsPrices?.map((opcao) => ({
                    size: opcao.measureUnit,
                    price: opcao.price.toFixed(2),
                  })) || [],
                };
              });

              return {
                id: categoria.Id,
                name: categoria.name,
                pratos: pratosFormatados,
              };
            } catch (error) {
              toast.error(`Falha ao carregar pratos de ${categoria.name}`);
              return { id: categoria.Id, name: categoria.name, pratos: [] };
            }
          })
        );

        setCategorias(categoriasComPratos);
      } catch (error) {
        toast.error("Falha ao carregar categorias");
      } finally {
        setCarregando(false);
      }
    }

    carregarCardapio();
  }, [token, restaurantId]);

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Carregando cardápio...</div>
      </div>
    );
  }

  const todosPratos = categorias.flatMap((categoria) => categoria.pratos);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <Header />
      <Banner />

      <TabbedSections
        title="Cardápio"
        data={todosPratos}
        getCategory={(item) => item.status || "Sem categoria"}
        renderItem={(item) => (
          <MenuItem
            key={item.id}
            {...item}
            token={token || ""}
            onClick={(produto) => setSelectedProduct(produto)}
            onDelete={(dishId) => handleDeleteDish(dishId, item.categoryId)}
          />
        )}
        renderAfterItems={() => <MenuItemAdd />}
      />

      {selectedProduct && (
        <ProductModal
          produto={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}