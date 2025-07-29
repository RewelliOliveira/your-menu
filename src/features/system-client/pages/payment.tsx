import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export function PaymentMethod() {
  return (
    <div className="flex flex-col bg-[#f5f5f5] items-center justify-center min-h-screen gap-4">
      <div className="flex flex-col w-full max-w-3xl p-6 bg-[#f5f5f5] rounded-lg border border-gray-400 shadow-md">
        <h1 className="flex w-full justify-center text-xl font-medium text-black/80 mb-6">
          Forma de pagamento
        </h1>

        <div className="flex flex-col gap-3">
          <Link
            to="/payment/pix"
            className="flex items-center gap-3 px-4 py-3 border rounded-md bg-white hover:bg-gray-100"
          >
            <Icon
              icon="simple-icons:pix"
              width={24}
              className="text-green-500"
            />
            <span>Pix</span>
          </Link>

          <button className="flex items-center gap-3 px-4 py-3 border rounded-md bg-white hover:bg-gray-100">
            <Icon
              icon="mdi:credit-card-outline"
              width={24}
              className="text-black"
            />
            <span>Cartão</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 border rounded-md bg-white hover:bg-gray-100">
            <Icon icon="mdi:cash" width={24} className="text-yellow-600" />
            <span>Dinheiro</span>
          </button>
        </div>
      </div>
    </div>
  );
}
