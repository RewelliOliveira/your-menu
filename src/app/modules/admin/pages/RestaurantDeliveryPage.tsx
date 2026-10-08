import { useEffect, useState, useCallback } from "react";
import { Header } from "@/app/components/layout/Header";
import { Button } from "@/app/components/ui/Button";
import { useAuth } from "@/app/hooks/use-auth";
import { useRestaurant } from "@/app/hooks/use-restaurant";
import {
  getDeliveryZones,
  saveDeliveryZone,
  deleteDeliveryZone,
  updateDeliveryZone,
} from "@/infrastructure/services/delivery-zone-service";
import { AddZoneModal } from "../components/AddZoneModal";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { DeliveryZone } from "@/core/types/delivery-zone-types";

export function RestaurantDeliveryPage() {
  const { token } = useAuth();
  const { slug } = useRestaurant();

  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editZone, setEditZone] = useState<DeliveryZone | null>(null);

  const fetchZones = useCallback(async () => {
    if (!slug) return;
    try {
      const data = await getDeliveryZones(slug, token || "");
      setZones(data || []);
    } catch {
      toast.error("Erro ao carregar zonas de entrega");
    }
  }, [token, slug]);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const handleAddOrEditZone = async (zone: string, fee: string) => {
    const feeNum = parseFloat(fee);

    try {
      setSaving(true);

      if (editZone && editZone.id) {
        await updateDeliveryZone(
          editZone.id,
          {
            zone,
            deliveryFee: feeNum,
            restaurantSlug: slug || "your-burger",
          },
          token || ""
        );

        setZones((prev) =>
          prev.map((z) =>
            z.id === editZone.id ? { ...z, zone, deliveryFee: feeNum } : z
          )
        );

        toast.success("Zona de entrega atualizada com sucesso!");
      } else {
        const exists = zones.some(
          (z) => z.zone.trim().toLowerCase() === zone.trim().toLowerCase()
        );
        if (exists) {
          toast.warn("Essa zona já está cadastrada.");
          setSaving(false);
          return;
        }

        const response = await saveDeliveryZone(
          {
            zone,
            deliveryFee: feeNum,
            restaurantSlug: slug || "your-burger",
          },
          token || ""
        );

        if (response.data?.id) {
          setZones((prev) => [...prev, response.data]);
        } else {
          await fetchZones();
        }

        toast.success("Zona de entrega cadastrada com sucesso!");
      }
    } catch {
      toast.error("Erro ao processar zona de entrega.");
    } finally {
      setSaving(false);
      setEditZone(null);
      setModalOpen(false);
    }
  };

  const handleDeleteZone = async (id: string) => {
    if (!id) return;

    try {
      await deleteDeliveryZone(id, token || "");
      setZones((prev) => prev.filter((z) => z.id !== id));
      toast.success("Zona excluída com sucesso!");
    } catch {
      toast.error("Erro ao excluir zona.");
    }
  };

  return (
    <div className="flex flex-col bg-[#f5f5f5] min-h-screen pb-16">
      <Header isAdmin={true} />

      <main className="max-w-4xl w-full mx-auto p-4 md:p-6 mt-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Taxas & Zonas de Entrega
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Configure os bairros atendidos e o valor do frete para cada um
              </p>
            </div>

            <Button
              onClick={() => {
                setEditZone(null);
                setModalOpen(true);
              }}
              size="sm"
              disabled={saving}
            >
              + Adicionar Nova Zona
            </Button>
          </div>

          <div className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="flex bg-gray-50 font-bold text-xs text-gray-600 uppercase border-b border-gray-200">
              <div className="w-1/2 px-4 py-3">Bairro / Região</div>
              <div className="w-1/4 px-4 py-3">Taxa (R$)</div>
              <div className="w-1/4 px-4 py-3 text-center">Ações</div>
            </div>

            {zones.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {zones.map((z) => (
                  <div
                    key={z.id}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-1/2 font-medium text-gray-800 text-sm">{z.zone}</div>
                    <div className="w-1/4 text-sm font-bold text-gray-900">
                      R$ {z.deliveryFee.toFixed(2).replace(".", ",")}
                    </div>
                    <div className="w-1/4 flex justify-center gap-2">
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                        onClick={() => {
                          setEditZone(z);
                          setModalOpen(true);
                        }}
                        title="Editar zona"
                        aria-label={`Editar zona ${z.zone}`}
                      >
                        <Icon icon="mdi:pencil-outline" className="w-4 h-4" />
                      </button>
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                        onClick={() => handleDeleteZone(z.id)}
                        title="Apagar zona"
                        aria-label={`Apagar zona ${z.zone}`}
                      >
                        <Icon icon="mdi:trash-can-outline" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                Nenhuma zona de entrega cadastrada. Clique em "+ Adicionar Nova Zona" acima.
              </div>
            )}
          </div>
        </div>
      </main>

      <AddZoneModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditZone(null);
        }}
        onAdd={handleAddOrEditZone}
        editData={
          editZone
            ? { zone: editZone.zone, valor: editZone.deliveryFee.toString() }
            : undefined
        }
      />
    </div>
  );
}
