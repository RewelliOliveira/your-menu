import { Header } from "../components/header";
import { MenuItem, OrderProps } from "../components/menu-item";
import { MenuItemAdd } from "../components/menu-item-add";
import { Banner } from "../components/ui/banner";

export const fakeOrders: OrderProps[] = [
  {
    name: "Lasanha à Bolonhesa",
    description:
      "Deliciosa lasanha com camadas de massa, carne moída, molho de tomate e muito queijo.",
    price: "32,90",
    foodImg: "https://images.unsplash.com/photo-1550547660-d9450f859349",
  },
  {
    name: "Hambúrguer Artesanal",
    description:
      "Pão brioche, hambúrguer 180g, cheddar, bacon crocante e molho especial da casa.",
    price: "24,50",
    foodImg: "https://images.unsplash.com/photo-1550547660-d9450f859349",
  },
  {
    name: "Pizza Margherita",
    description:
      "Massa fina com molho de tomate, queijo mozzarella, manjericão fresco e azeite de oliva.",
    price: "39,90",
    foodImg: "https://images.unsplash.com/photo-1550547660-d9450f859349",
  },
  {
    name: "Yakissoba de Frango",
    description:
      "Macarrão oriental com frango, legumes frescos e molho shoyu especial.",
    price: "28,00",
    foodImg: "https://images.unsplash.com/photo-1550547660-d9450f859349",
  },
  {
    name: "Salada Tropical",
    description:
      "Mix de folhas verdes, manga, morango, castanhas e molho de iogurte com mel.",
    price: "19,90",
    foodImg: "https://images.unsplash.com/photo-1550547660-d9450f859349",
  },
];

export function EditOrders() {
  return (
    <div className="bg-[#f5f5f5]">
      <Header />
      <Banner />
      <div className="grid grid-cols-1 w-3/4 mx-auto justify-items-center justify-between sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {fakeOrders.map((order) => (
          <MenuItem
            key={order.name}
            description={order.description}
            name={order.name}
            price={order.price}
            foodImg={order.foodImg}
          />
        ))}
        <MenuItemAdd />
      </div>
    </div>
  );
}
