import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export function PaymentMethod() {
  return (
    <section className="flex flex-col items-center justify-center w-full min-h-screen p-4 bg-white">
      <div className="flex flex-col w-full max-w-3xl p-6 bg-[#f5f5f5] rounded-lg border border-gray-400 shadow-md">
        <h1 className="flex w-full justify-center text-2xl font-bold text-black mb-6">
          Forma de pagamento
        </h1>

        <div className="flex flex-col gap-3 p-4">
          <Link
            to="/payment/pix"
            className="flex items-center gap-3 px-4 py-3 border rounded-md bg-white hover:bg-gray-100 transition"
          >
            <Icon
              icon="simple-icons:pix"
              width={24}
              className="text-green-500"
            />
            <span className="text-base font-medium">Pix</span>
          </Link>

          <button className="flex items-center gap-3 px-4 py-3 border rounded-md bg-white hover:bg-gray-100 transition">
            <Icon
              icon="mdi:credit-card-outline"
              width={24}
              className="text-black"
            />
            <span className="text-base font-medium">Cartão</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 border rounded-md bg-white hover:bg-gray-100 transition">
            <Icon icon="mdi:cash" width={24} className="text-yellow-600" />
            <span className="text-base font-medium">Dinheiro</span>
          </button>
        </div>
      </div>
    </section>
  );
}
