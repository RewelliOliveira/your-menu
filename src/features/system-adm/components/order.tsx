import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export function Order() {
  const [data, setData] = useState({
    foodImg: "",
    name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = {
        foodImg:
          "https://i.pinimg.com/736x/24/c6/a7/24c6a7e6e183d78d9d1beea77b6d160e.jpg",
        name: "Lasanha",
        description:
          "Lasanha de carne com molho especial muito bom e gostoso meu deus do céu que legal ficou isso aqui.",
        price: "29,90",
      };
      setData(response);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col bg-white w-55 h-60 m-10 rounded-sm shadow-xl/10">
      <img
        src={data.foodImg || "placeholder.svg"}
        alt="Imagem da comida"
        className="w-full h-24 object-cover rounded-t"
      />
      <div className="p-3 flex flex-col flex-1">
        <h2 className="font-bold text-base">{data.name}</h2>
        <p className="text-xs text-gray-500 break-words overflow-hidden">
          {data.description}
        </p>
        <div className="flex justify-between items-end flex-1 mt-2">
          <p className="font-semibold">R${data.price}</p>
          <div className="bg-white shadow-md w-8 h-8 flex items-center justify-center rounded">
            <Icon icon="solar:pen-2-outline" className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
