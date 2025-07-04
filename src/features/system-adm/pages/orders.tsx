import { Header } from "../components/header";
import { Banner } from "../components/ui/banner";
import { CardOrder } from "../components/ui/card-order";
import { TabbedSections } from "../components/ui/tabbed-sections";

export type Order = {
  id: number;
  customer: string;
  items: string[];        // agora é array de strings
  address: string;
  price: number;
  status: "Solicitados" | "Em preparo" | "Em entrega" | "Entregue";
};

export function Orders() {
  const orders: Order[] = [
    {
      id: 1,
      customer: "Antonio Fagundes",
      items: ["Pizza de Frango com Catupiry"],
      address: "Av. Piedade Castelo, 234 – Centro",
      price: 7.99,
      status: "Solicitados",
    },
    {
      id: 2,
      customer: "Mariana Silva",
      items: ["Hambúrguer Clássico"],
      address: "Rua das Flores, 123 – Jardim",
      price: 15.5,
      status: "Entregue",
    },
    {
      id: 3,
      customer: "João Pereira",
      items: ["Sushi Combo 20 peças"],
      address: "Av. Brasil, 456 – Centro",
      price: 45.0,
      status: "Em entrega",
    },
    {
      id: 4,
      customer: "Carla Souza",
      items: ["Lasanha à Bolonhesa"],
      address: "Rua do Comércio, 78 – Vila Rica",
      price: 32.5,
      status: "Entregue",
    },
    {
      id: 5,
      customer: "Rafael Costa",
      items: ["Salada Caesar"],
      address: "Alameda Santos, 90 – Jardins",
      price: 22.0,
      status: "Solicitados",
    },
    {
      id: 6,
      customer: "Fernanda Lima",
      items: ["Espaguete Carbonara"],
      address: "Rua Nova, 15 – Centro",
      price: 28.0,
      status: "Solicitados",
    },
    {
      id: 7,
      customer: "Lucas Fernandes",
      items: ["Pizza Calabresa"],
      address: "Av. Paulista, 1000 – Bela Vista",
      price: 38.5,
      status: "Entregue",
    },
    {
      id: 8,
      customer: "Patrícia Gomes",
      items: ["Hambúrguer Vegano"],
      address: "Rua Verde, 45 – Jardim Botânico",
      price: 18.0,
      status: "Em entrega",
    },
    {
      id: 9,
      customer: "Roberto Silva",
      items: ["Sushi 10 peças"],
      address: "Rua das Palmeiras, 220 – Centro",
      price: 35.0,
      status: "Em preparo",
    },
    {
      id: 10,
      customer: "Ana Paula",
      items: ["Frango Grelhado com Arroz"],
      address: "Rua do Lago, 34 – Vila Nova",
      price: 25.0,
      status: "Em preparo",
    },
    // exemplo de pedido com vários itens pra testar
    {
      id: 21,
      customer: "Teste Multi Itens",
      items: Array.from({ length: 50 }, (_, i) => `Produto #${i + 1}`),
      address: "Rua Teste, 123",
      price: 200,
      status: "Solicitados",
    },
  ];

  const entregues = orders.filter((order) => order.status === "Entregue");
  const total = entregues.reduce((acc, order) => acc + order.price, 0);

  return (
    <>
      <Header />
      <Banner />
      <TabbedSections
        title="Pedidos"
        getCategory={(order) => order.status}
        data={orders}
        renderItem={(order) => <CardOrder order={order} />}
        categoriesOrder={[
          "Solicitados",
          "Em preparo",
          "Em entrega",
          "Entregue",
        ]}
      />

      <footer className="pb-15">
        <div className="flex justify-between items-center bg-gray-100 p-4 border-t border-gray-300 fixed bottom-0 left-0 w-full z-50">
          <div>
            <p className="text-sm text-gray-600">Total de vendas hoje</p>
            <p className="text-lg font-semibold">
              R$ {total.toFixed(2)}{" "}
              <span className="text-sm font-normal text-gray-600">
                / {entregues.length} pedidos
              </span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
