// CARD TEMPORARIO

type Order = {
    id: number;
    customer: string;
    item: string;
    address: string;
    price: number;
    status: "Solicitados" | "Em preparo" | "Em entrega" | "Entregue";
  };
  
  type CardOrdersProps = {
    data: Order; // aqui tem que ser igual ao seu tipo Order
  };
  
  export function CardOrders({ data }: CardOrdersProps) {
    return (
      <div>
        <p>{data.customer}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>
            <p>{data.item}</p>

      </div>
    );
  }
  