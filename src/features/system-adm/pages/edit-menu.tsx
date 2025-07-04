import { Header } from "../components/header";
import { MenuItem, OrderProps } from "../components/menu-item";
import { MenuItemAdd } from "../components/menu-item-add";
import { Banner } from "../components/ui/banner";
import { TabbedSections } from "../components/ui/tabbed-sections";

export const fakeOrders: OrderProps[] = [
  {
    name: "Lasanha à Bolonhesa",
    description: "Deliciosa lasanha com camadas...",
    price: "32,90",
    foodImg: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    status: "Massas",
  },
  {
    name: "Hambúrguer Artesanal",
    description: "Pão brioche, hambúrguer 180g...",
    price: "24,50",
    foodImg: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    status: "Lanches",
  },
  {
    name: "Pizza Margherita",
    description: "Massa fina com molho de tomate...",
    price: "39,90",
    foodImg: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    status: "Pizzas",
  },
  {
    name: "Yakissoba de Frango",
    description: "Macarrão oriental com frango...",
    price: "28,00",
    foodImg: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    status: "Oriental",
  },
  {
    name: "Salada Tropical",
    description: "Mix de folhas verdes...",
    price: "19,90",
    foodImg: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    status: "Saladas",
  },
  {
    name: "Risoto de Camarão",
    description: "Arroz cremoso com camarões frescos e ervas finas.",
    price: "44,90",
    foodImg: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    status: "Massas",
  },
  {
    name: "Tábua de Frios",
    description: "Seleção de queijos, embutidos e frutas.",
    price: "59,90",
    foodImg: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c",
    status: "Entradas",
  },
  {
    name: "Sushi Especial",
    description: "Combo de sushis variados com peixes frescos.",
    price: "49,90",
    foodImg: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0",
    status: "Oriental",
  },
  {
    name: "Brownie com Sorvete",
    description: "Brownie de chocolate servido com sorvete de creme.",
    price: "18,00",
    foodImg: "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb",
    status: "Sobremesas",
  },
  {
    name: "Suco Natural de Laranja",
    description: "Suco fresco feito na hora.",
    price: "8,00",
    foodImg: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc",
    status: "Bebidas",
  },
];

export function EditMenu() {
  return (
    <div className="bg-[#f5f5f5]">
      <Header />
      <Banner />
      <TabbedSections
        title="Editar Cardápio"
        data={fakeOrders}
        getCategory={(item) => item.status}
        renderItem={(item) => (
          <MenuItem
            name={item.name}
            description={item.description}
            price={item.price}
            foodImg={item.foodImg}
            status={item.status}
          />
        )}
        renderAfterItems={() => <MenuItemAdd />}
      />
    </div>
  );
}
