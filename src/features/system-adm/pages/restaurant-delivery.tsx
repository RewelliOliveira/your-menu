import { useEffect, useState } from "react";
import { Header } from "../components/header";
import { Button } from "../components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { getDeliveryZones, saveDeliveryZone } from "@/services/delivery-zone";
import { AddZoneModal } from "../components/ui/add-zone-modal";
import { useRestaurant } from "@/contexts/restaurant-context";

interface Zone {
  id?: string;
  zone: string;
  deliveryFee: string;
}

export function RestaurantDelivery() {
  const { token } = useAuth();
  const { slug } = useRestaurant();
  const [zones, setZones] = useState<Zone[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchZones = async () => {
    if (!token || !slug) return;
    try {
      const data = await getDeliveryZones(slug, token);
      if (data?.length) {
        setZones(
          data.map((z: any) => ({
            id: z.id,
            zone: z.zone,
            deliveryFee: z.deliveryFee.toFixed(2),
          }))
        );
      } else {
        setZones([]);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar zonas de entrega");
    }
  };

  useEffect(() => {
    fetchZones();
  }, [token, slug]);

  const handleAddZone = async (zone: string, fee: string) => {
    if (!token || !slug) {
      alert("Token ou slug ausentes");
      return;
    }

    const exists = zones.some(
      (z) => z.zone.trim().toLowerCase() === zone.trim().toLowerCase()
    );
    if (exists) {
      alert("Essa zona já está cadastrada.");
      return;
    }

    try {
      setSaving(true);
      await saveDeliveryZone(
        {
          zone,
          deliveryFee: parseFloat(fee),
          restaurantSlug: slug,
        },
        token
      );
      alert("Zona adicionada com sucesso!");
      await fetchZones();
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar zona");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#f5f5f5] items-center min-h-screen gap-4">
      <Header />
      <div className="bg-[#f5f5f5] max-w-[75%] w-full p-10 rounded-2xl border border-black/20 shadow-sm">
        <h1 className="flex w-full justify-center text-2xl font-medium text-black/80 mb-8">
          Informações de entrega
        </h1>

        <div className="w-full border rounded-md overflow-hidden bg-[#f5f5f5]">
          <div className="flex bg-gray-300 font-medium">
            <div className="w-3/4 px-4 py-2">Local</div>
            <div className="w-1/4 px-4 py-2">Valor (R$)</div>
          </div>

          {zones.length > 0 ? (
            zones.map((z, idx) => (
              <div key={idx} className="flex border-t border-gray-300 bg-white">
                <div className="w-3/4 px-4 py-2">{z.zone}</div>
                <div className="w-1/4 px-4 py-2">R$ {z.deliveryFee}</div>
              </div>
            ))
          ) : (
            <div className="flex border-t border-gray-300 bg-white">
              <div className="w-full px-4 py-2 text-gray-400">
                Nenhuma zona cadastrada
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6 w-full">
          <Button
            onClick={() => setModalOpen(true)}
            className="!bg-green-600 !hover:bg-green-500 !text-white !w-40 !h-10"
            disabled={saving}
          >
            {saving ? "Salvando..." : "Adicionar zona"}
          </Button>
        </div>
      </div>

      <AddZoneModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddZone}
      />
    </div>
  );
}
