import { Header } from "../components/header";
import { Banner } from "../components/ui/banner";
import { TabbedSections } from "../components/ui/tabbed-sections";
import { CardOrders } from "../components/ui/card-orders";

type Order = {
  id: number;
  customer: string;
  item: string;
  address: string;
  price: number;
  status: "Solicitados" | "Em preparo" | "Em entrega" | "Entregue";
};

export function Orders() {

  const orders: Order[] = [
    { id: 1, customer: "Antonio Fagundes", item: "Pizza de Frango com Catupiry", address: "Av. Piedade Castelo, 234 – Centro", price: 7.99, status: "Solicitados" },
    { id: 2, customer: "Mariana Silva", item: "Hambúrguer Clássico", address: "Rua das Flores, 123 – Jardim", price: 15.5, status: "Em preparo" },
    { id: 3, customer: "João Pereira", item: "Sushi Combo 20 peças", address: "Av. Brasil, 456 – Centro", price: 45.0, status: "Em entrega" },
    { id: 4, customer: "Carla Souza", item: "Lasanha à Bolonhesa", address: "Rua do Comércio, 78 – Vila Rica", price: 32.5, status: "Em preparo" },
    { id: 5, customer: "Rafael Costa", item: "Salada Caesar", address: "Alameda Santos, 90 – Jardins", price: 22.0, status: "Solicitados" },
    { id: 6, customer: "Fernanda Lima", item: "Espaguete Carbonara", address: "Rua Nova, 15 – Centro", price: 28.0, status: "Solicitados" },
    { id: 7, customer: "Lucas Fernandes", item: "Pizza Calabresa", address: "Av. Paulista, 1000 – Bela Vista", price: 38.5, status: "Em preparo" },
    { id: 8, customer: "Patrícia Gomes", item: "Hambúrguer Vegano", address: "Rua Verde, 45 – Jardim Botânico", price: 18.0, status: "Em entrega" },
    { id: 9, customer: "Roberto Silva", item: "Sushi 10 peças", address: "Rua das Palmeiras, 220 – Centro", price: 35.0, status: "Em preparo" },
    { id: 10, customer: "Ana Paula", item: "Frango Grelhado com Arroz", address: "Rua do Lago, 34 – Vila Nova", price: 25.0, status: "Solicitados" },
    { id: 11, customer: "Marcos Oliveira", item: "Bife Acebolado", address: "Rua das Rosas, 90 – Centro", price: 30.0, status: "Solicitados" },
    { id: 12, customer: "Luciana Martins", item: "Risoto de Camarão", address: "Av. Central, 500 – Centro", price: 40.0, status: "Em preparo" },
    { id: 13, customer: "Júlio César", item: "Pizza Portuguesa", address: "Rua das Flores, 33 – Centro", price: 37.5, status: "Em entrega" },
    { id: 14, customer: "Simone Reis", item: "Macarrão ao Molho Pesto", address: "Rua da Praia, 77 – Vila Rica", price: 27.0, status: "Em preparo" },
    { id: 15, customer: "Gabriel Souza", item: "Hambúrguer com Bacon", address: "Rua das Orquídeas, 10 – Jardim", price: 20.0, status: "Solicitados" },
    { id: 16, customer: "Patrícia Lima", item: "Salada Grega", address: "Av. Brasil, 200 – Centro", price: 18.5, status: "Solicitados" },
    { id: 17, customer: "Thiago Silva", item: "Frango à Parmegiana", address: "Rua do Comércio, 88 – Vila Rica", price: 35.0, status: "Em preparo" },
    { id: 18, customer: "Renata Santos", item: "Sushi 30 peças", address: "Rua Nova, 20 – Centro", price: 60.0, status: "Em entrega" },
    { id: 19, customer: "André Oliveira", item: "Lasanha Vegetariana", address: "Av. Paulista, 1234 – Bela Vista", price: 30.0, status: "Em preparo" },
    { id: 20, customer: "Larissa Gomes", item: "Pizza Quatro Queijos", address: "Rua das Flores, 77 – Jardim", price: 38.0, status: "Solicitados" },
  ];

  return (
    <>
      <Header />
      <Banner />
      <TabbedSections
        title="Pedidos"
        categories={["Solicitados", "Em preparo", "Em entrega", "Entregue"]}
        data={orders} //array de objetos que você manda
        renderItem={(order) => <CardOrders data={order} />} //transforma e exibe, com os dados de ordem recebidos, um CardOrder (componente temporario)
      />
    </>
  );
}
