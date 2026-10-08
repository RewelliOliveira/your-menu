import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/Button";
import { useAuth } from "@/app/hooks/use-auth";
import { toast } from "react-toastify";

export function PixPaymentPage() {
  const qrCodeLink =
    "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913YourMenu Demo6009Sao Paulo62070503***6304E2CA";
  const navigate = useNavigate();
  const { restaurantId } = useAuth();
  const targetRestaurant = restaurantId || "rest-mock-123";

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeLink);
      toast.success("Código Pix Copia e Cola copiado para a área de transferência!");
    } catch {
      toast.info("Código Pix copiado!");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="flex flex-col w-full max-w-lg p-6 md:p-8 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="border-b pb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Pagamento via Pix</h1>
          <p className="text-xs text-gray-500 mt-1">
            Escaneie o QR Code ou copie o código abaixo no seu banco
          </p>
        </div>

        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=your-menu-demo-pix"
              alt="QR Code Pix do Pedido"
              className="w-44 h-44"
            />
          </div>
        </div>

        <div
          onClick={handleCopyPix}
          className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-orange-50/50 hover:border-orange-300 transition-all group"
          title="Clique para copiar o código Pix"
        >
          <span className="text-xs text-gray-600 font-mono truncate">{qrCodeLink}</span>
          <Icon
            icon="mdi:content-copy"
            className="text-orange-600 w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => navigate(`/${targetRestaurant}`)}
          >
            ← Concluir e Voltar
          </Button>

          <Button
            className="flex-1 bg-green-600 hover:bg-green-500"
            onClick={handleCopyPix}
          >
            Copiar Código Pix
          </Button>
        </div>
      </div>
    </section>
  );
}
