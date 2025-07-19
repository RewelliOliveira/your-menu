import { useEffect, useState } from "react";
import { Header } from "../components/header";
import { MenuItem, OrderProps } from "../components/ui/menu-item";
import { Banner } from "../components/ui/banner";
import { TabbedSections } from "@/features/system-adm/components/ui/tabbed-sections";
import { getPratosPorCategoria } from "@/services/create-dish";
import { getCategoriesApi } from "@/services/category-api";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "react-toastify";

interface CategoriaComPratos {
    id: number;
    name: string;
    pratos: OrderProps[];
}

export function MenuClient() {
    const [categorias, setCategorias] = useState<CategoriaComPratos[]>([]);
    const [carregando, setCarregando] = useState(true);
    const { token, restaurantId } = useAuth();

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

                            const pratosFormatados: OrderProps[] = pratosAPI.flatMap((prato) => {
                                return prato.sizeOptionsPrices?.map((opcao) => {
                                    const urlConvertida = prato.imgUrl
                                        ? prato.imgUrl.replace(
                                            "s3://upload-images-teste-1/",
                                            "https://upload-images-teste-1.s3.sa-east-1.amazonaws.com/"
                                        )
                                        : "https://via.placeholder.com/150";

                                    return {
                                        id: `${prato.id}-${opcao.sizeOptionId}`,
                                        name: prato.name + ` (${opcao.measureUnit})`,
                                        description: prato.description,
                                        price: opcao.price.toFixed(2),
                                        foodImg: urlConvertida,
                                        status: categoria.name,
                                        isAvailable: prato.isAvailable,
                                        sizeOptions: [],
                                    };
                                }) ?? [];
                            });

                            return {
                                id: categoria.Id,
                                name: categoria.name,
                                pratos: pratosFormatados,
                            };
                        } catch (error) {
                            console.error(
                                `Erro ao carregar pratos da categoria ${categoria.name}:`,
                                error
                            );
                            toast.error(`Falha ao carregar pratos de ${categoria.name}`);
                            return {
                                id: categoria.Id,
                                name: categoria.name,
                                pratos: [],
                            };
                        }
                    })
                );

                setCategorias(categoriasComPratos);
            } catch (error) {
                console.error("Erro ao carregar cardápio:", error);
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
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        foodImg={item.foodImg}
                        status={item.status}
                        sizeOptions={item.sizeOptions}
                    />
                )}
            />
        </div>
    );
}
