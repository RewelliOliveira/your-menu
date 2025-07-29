import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export function PixPayment() {
  const qrCodeLink = "hbdajhbd333432-dsfsfsdfsdf-sdfsdfs-34342e";
  const navigate = useNavigate();
  return (
    <div className="flex flex-col bg-[#f5f5f5] items-center justify-center min-h-screen">
      <div className="flex flex-col w-full max-w-3xl p-6 bg-[#f5f5f5] rounded-lg border border-gray-400 shadow-md">
        <h1 className="self-center text-xl font-medium text-black/80 mb-4">
          QrCode
        </h1>

        <div className="self-center mb-4">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example"
            alt="QR Code"
            className="w-40 h-40"
          />
        </div>

        <div className="flex items-center gap-2 mb-6 flex-wrap justify-center">
          <Icon
            icon="mdi:content-copy"
            className="text-gray-500 cursor-pointer"
          />
          <span className="text-sm text-red-500 break-all">{qrCodeLink}</span>
        </div>

        <div className="flex flex-wrap gap-4 w-full justify-center">
          <Button
            variant="dark"
            className="!w-45 flex items-center justify-center gap-1"
            onClick={() => navigate("/")}
          >
            <Icon icon="mdi:keyboard-return" />
            <span>Voltar ao menu</span>
          </Button>

          <Button
            variant="primary"
            className="!bg-green-600 hover:!bg-green-500 !w-60 flex items-center justify-center gap-1"
            onClick={() => console.log("Compartilhar")}
          >
            <Icon icon="mdi:whatsapp" />
            <span>Compartilhar comprovante</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
