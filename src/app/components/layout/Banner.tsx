import { useState, useEffect } from "react";
import { ConfirmModal } from "../ui/ConfirmModal";
import {
  getRestaurantProfileApi,
  toggleRestaurantOpenStatusApi,
} from "@/infrastructure/services/restaurant-service";
import { useAuth } from "@/app/hooks/use-auth";
import { toast } from "react-toastify";

export interface BannerProps {
  isAdmin?: boolean;
}

export function Banner({ isAdmin = false }: BannerProps) {
  const { token, restaurantId } = useAuth();

  const [data, setData] = useState({
    title: "YourBurger Artesanal",
    logoUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&auto=format&fit=crop&q=80",
    backgroundUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
    estimatedTime: "30-45 min",
    isOpen: true,
  });

  const [showModal, setShowModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const restaurant = await getRestaurantProfileApi(token || undefined);
        setData({
          title: restaurant.name || "Seu Restaurante",
          logoUrl: restaurant.profilePicUrl || "/placeholder.svg",
          backgroundUrl: restaurant.bannerPicUrl || "/placeholder.svg",
          estimatedTime: `${restaurant.deliveryTimeMin}-${restaurant.deliveryTimeMax} min`,
          isOpen: restaurant.isOpen,
        });
      } catch (error) {
        console.error("Erro ao carregar perfil no banner:", error);
      }
    }

    fetchProfile();
  }, [token]);

  const handleToggleRequest = () => {
    setPendingStatus(!data.isOpen);
    setShowModal(true);
  };

  const confirmToggle = async () => {
    if (!token || !restaurantId) {
      toast.error("Credenciais não encontradas.");
      setShowModal(false);
      return;
    }

    try {
      await toggleRestaurantOpenStatusApi(restaurantId, pendingStatus, token);
      setData((prev) => ({ ...prev, isOpen: pendingStatus }));
      toast.success(
        pendingStatus
          ? "Restaurante aberto para pedidos!"
          : "Restaurante fechado temporariamente."
      );
    } catch {
      toast.error("Erro ao alterar status do restaurante.");
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="relative w-full h-56 md:h-64 bg-gray-900 text-white flex items-center justify-center overflow-hidden">
        <img
          src={data.backgroundUrl}
          alt="Banner de fundo do restaurante"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-40 filter blur-[1px]"
        />

        {isAdmin && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <button
              onClick={handleToggleRequest}
              type="button"
              aria-label={data.isOpen ? "Fechar restaurante" : "Abrir restaurante"}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                data.isOpen ? "bg-green-500" : "bg-gray-500"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                  data.isOpen ? "translate-x-5" : ""
                }`}
              />
            </button>
            <span className="text-xs md:text-sm font-medium pr-1">
              Restaurante {data.isOpen ? "Aberto" : "Fechado"}
            </span>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <div className="w-22 h-22 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center overflow-hidden mb-3 border-2 border-white/90 shadow-lg">
            <img
              src={data.logoUrl}
              alt={data.title}
              className="object-cover w-full h-full"
            />
          </div>

          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-md">
            {data.title}
          </h1>

          <div className="flex gap-5 items-center text-xs md:text-sm mt-2 text-white/90">
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  data.isOpen ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span>{data.isOpen ? "Aberto agora" : "Fechado"}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
              <img src="/timer.svg" alt="Tempo de entrega" className="w-4 h-4 opacity-90" />
              <span>{data.estimatedTime}</span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ConfirmModal
          title={pendingStatus ? "Abrir Restaurante" : "Fechar Restaurante"}
          content={`Tem certeza que deseja ${
            pendingStatus ? "abrir" : "fechar"
          } o restaurante para novos pedidos?`}
          buttonmsg="Confirmar"
          onConfirm={confirmToggle}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
