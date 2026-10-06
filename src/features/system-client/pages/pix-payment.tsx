import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "react-toastify";

export function PixPayment() {
  const qrCodeLink = "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913YourMenu Demo6009Sao Paulo62070503***6304E2CA";
  const navigate = useNavigate();
  const { restaurantId } = useAuth();
  const targetRestaurant = restaurantId || "rest-mock-123";

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeLink);
      toast.success("Código Copia e Cola copiado com sucesso!");
    } catch {
      toast.info("Código copiado!");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center w-full min-h-screen p-4 bg-white">
      <div className="flex flex-col w-full max-w-3xl p-6 bg-[#f5f5f5] rounded-lg border border-gray-400 shadow-md">
        <h1 className="self-center text-2xl font-bold text-black mb-6">
          Pagamento via Pix
        </h1>

        <div className="self-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=your-menu-demo-pix"
            alt="QR Code Pix"
            className="w-44 h-44"
          />
        </div>

        <p className="text-center text-sm text-gray-600 mb-2">
          Escaneie o QR Code acima ou utilize o código Copia e Cola:
        </p>

        <div
          onClick={handleCopyPix}
          className="flex items-center justify-between gap-2 mb-6 px-4 py-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition max-w-xl mx-auto w-full"
          title="Clique para copiar"
        >
          <span className="text-xs text-gray-700 font-mono truncate">{qrCodeLink}</span>
          <Icon
            icon="mdi:content-copy"
            className="text-orange-600 w-5 h-5 flex-shrink-0"
          />
        </div>

        <div className="flex flex-wrap gap-4 w-full justify-center">
          <Button
            variant="dark"
            className="w-45 flex items-center justify-center gap-1"
            onClick={() => navigate(`/${targetRestaurant}`)}
          >
            <Icon icon="mdi:keyboard-return" />
            <span>Voltar ao menu</span>
          </Button>

          <Button
            variant="primary"
            className="bg-green-600 hover:bg-green-500 w-60 flex items-center justify-center gap-1"
            onClick={handleCopyPix}
          >
            <Icon icon="mdi:content-copy" />
            <span>Copiar Código Pix</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
