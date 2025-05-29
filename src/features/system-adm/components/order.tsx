import { Icon } from "@iconify/react";

export function Order() {
  return (
    <div className="flex flex-col bg-white w-55 h-60 m-10 rounded-sm shadow-xl/10">
      <img
        src="placeholder.svg"
        alt=""
        className="w-full h-24 object-cover rounded-t"
      />
      <div className="p-3 flex flex-col flex-1">
        <h2 className="font-bold flex-1">name</h2>
        <p className="text-xs text-gray-500 flex-1">description</p>
        <div className="flex items-center justify-between items-end flex-1">
          <p className="font-semibold">R$price</p>
          <div className="bg-white shadow-md w-8 h-8 flex items-center justify-center rounded">
            <Icon icon="solar:pen-2-outline" className="w-8 h-8 p-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
