import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/app/hooks/use-auth";

export function PaymentMethodPage() {
  const navigate = useNavigate();
  const { restaurantId } = useAuth();
  const targetRestaurant = restaurantId || "rest-mock-123";

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="flex flex-col w-full max-w-lg p-6 md:p-8 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="border-b pb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Forma de Pagamento
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Escolha como prefere pagar o seu pedido
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/payment/pix"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white hover:border-orange-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <Icon icon="simple-icons:pix" width={22} />
              </div>
              <div>
                <span className="text-base font-bold text-gray-800 block">
                  Pix Instantâneo
                </span>
                <span className="text-xs text-gray-500">
                  Aprovação imediata via QR Code ou Copia e Cola
                </span>
              </div>
            </div>
            <span className="text-orange-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>

          <button
            type="button"
            onClick={() => {
              toast.success("Opção 'Cartão na Entrega' selecionada!");
              navigate(`/${targetRestaurant}`);
            }}
            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white hover:border-orange-500 hover:shadow-xs transition-all group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Icon icon="mdi:credit-card-outline" width={24} />
              </div>
              <div>
                <span className="text-base font-bold text-gray-800 block">
                  Cartão (Débito ou Crédito)
                </span>
                <span className="text-xs text-gray-500">
                  Maquininha levada pelo entregador na entrega
                </span>
              </div>
            </div>
            <span className="text-orange-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              toast.success("Opção 'Dinheiro na Entrega' selecionada!");
              navigate(`/${targetRestaurant}`);
            }}
            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white hover:border-orange-500 hover:shadow-xs transition-all group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Icon icon="mdi:cash" width={24} />
              </div>
              <div>
                <span className="text-base font-bold text-gray-800 block">
                  Dinheiro
                </span>
                <span className="text-xs text-gray-500">
                  Pagamento em espécie na entrega
                </span>
              </div>
            </div>
            <span className="text-orange-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
