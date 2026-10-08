import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Header } from "@/app/components/layout/Header";
import { Banner } from "@/app/components/layout/Banner";
import { MenuItemClient, MenuItemClientSizeOption } from "../components/MenuItemClient";
import { TabbedSections } from "@/app/components/layout/TabbedSections";
import { getCategoriesApi } from "@/infrastructure/services/category-service";
import { getPratosPorCategoria } from "@/infrastructure/services/dish-service";
import { useAuth } from "@/app/hooks/use-auth";
import { Dish } from "@/core/types/dish-types";

interface CategoriaCardapio {
  id: number;
  name: string;
  pratos: Dish[];
}

export function MenuClientPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [categorias, setCategorias] = useState<CategoriaCardapio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const { token } = useAuth();

  const activeRestaurantId = restaurantId || "rest-mock-123";

  useEffect(() => {
    async function carregarCardapio() {
      setCarregando(true);

      try {
        const categoriasAPI = await getCategoriesApi(activeRestaurantId, token || "");

        const categoriasComPratos = await Promise.all(
          categoriasAPI.map(async (categoria) => {
            try {
              const pratosAPI = await getPratosPorCategoria(
                activeRestaurantId,
                categoria.id,
                token || ""
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
        toast.error("Falha ao carregar cardápio do restaurante");
      } finally {
        setCarregando(false);
      }
    }

    carregarCardapio();
  }, [token, activeRestaurantId]);

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f5f5f5]">
        <div className="text-base font-medium text-gray-600">Carregando cardápio...</div>
      </div>
    );
  }

  const todosPratos = categorias.flatMap((categoria) =>
    categoria.pratos.map((p) => ({
      ...p,
      categoryName: categoria.name,
    }))
  );

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-16">
      <Header isAdmin={false} />
      <Banner isAdmin={false} />

      <TabbedSections
        title="Cardápio Digital"
        data={todosPratos}
        getCategory={(item) => item.categoryName}
        renderItem={(item) => {
          const menorPreco = item.sizeOptionsPrices?.length
            ? Math.min(...item.sizeOptionsPrices.map((s) => s.price))
            : 0;

          const sizeOpts: MenuItemClientSizeOption[] = (item.sizeOptionsPrices || []).map((s) => ({
            id: s.dishSizeOptionId,
            size: s.measureUnit,
            price: s.price.toFixed(2),
          }));

          return (
            <MenuItemClient
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={menorPreco.toFixed(2)}
              foodImg={item.imgUrl}
              status={item.categoryName}
              sizeOptions={sizeOpts}
            />
          );
        }}
      />
    </div>
  );
}
