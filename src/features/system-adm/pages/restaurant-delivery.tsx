import { useEffect, useState } from "react";
import { Header } from "../components/header";
import { Button } from "../components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
  getDeliveryZones,
  saveDeliveryZone,
  deleteDeliveryZone,
  updateDeliveryZone,
} from "@/services/delivery-zone";
import { AddZoneModal } from "../components/ui/add-zone-modal";
import { useRestaurant } from "@/contexts/restaurant-context";
import { Icon } from "@iconify/react";

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
  const [editZone, setEditZone] = useState<Zone | null>(null);

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

  const handleAddOrEditZone = async (zone: string, fee: string) => {
    if (!token || !slug) {
      alert("Token ou slug ausentes");
      return;
    }

    try {
      setSaving(true);

      if (editZone && editZone.id) {
        // Editando zona existente
        await updateDeliveryZone(
          editZone.id,
          {
            zone,
            deliveryFee: parseFloat(fee),
            restaurantSlug: slug,
          },
          token
        );

        // Atualiza localmente a zona editada, mantendo posição
        setZones((prevZones) =>
          prevZones.map((z) =>
            z.id === editZone.id
              ? { ...z, zone, deliveryFee: parseFloat(fee).toFixed(2) }
              : z
          )
        );
      } else {
        // Verifica se já existe zona com esse nome
        const exists = zones.some(
          (z) => z.zone.trim().toLowerCase() === zone.trim().toLowerCase()
        );
        if (exists) {
          alert("Essa zona já está cadastrada.");
          setSaving(false);
          return;
        }

        const response = await saveDeliveryZone(
          {
            zone,
            deliveryFee: parseFloat(fee),
            restaurantSlug: slug,
          },
          token
        );

        const newZone = response.data;

        if (newZone?.id) {
          setZones((prevZones) => [
            ...prevZones,
            {
              id: newZone.id,
              zone: newZone.zone,
              deliveryFee: newZone.deliveryFee.toFixed(2),
            },
          ]);
        } else {
          // fallback se não retornar id, recarrega geral
          await fetchZones();
        }
      }
    } catch (err) {
      console.error(err);
      alert(editZone ? "Erro ao editar zona" : "Erro ao adicionar zona");
    } finally {
      setSaving(false);
      setEditZone(null);
      setModalOpen(false);
    }
  };

  const handleDeleteZone = async (id: string | undefined) => {
    if (!id || !token) return;

    try {
      await deleteDeliveryZone(id, token);
      setZones((prev) => prev.filter((z) => z.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao apagar zona");
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
            <div className="w-1/2 px-4 py-2">Local</div>
            <div className="w-1/4 px-4 py-2">Valor (R$)</div>
            <div className="w-1/4 px-4 py-2 text-center">Ações</div>
          </div>

          {zones.length > 0 ? (
            zones.map((z) => (
              <div
                key={z.id}
                className="flex border-t border-gray-300 bg-white items-center"
              >
                <div className="w-1/2 px-4 py-2">{z.zone}</div>
                <div className="w-1/4 px-4 py-2">R$ {z.deliveryFee}</div>
                <div className="w-1/4 px-4 py-2 flex justify-center gap-2">
                  <button
                    className="bg-red-100 hover:bg-red-200 p-1 rounded"
                    onClick={() => handleDeleteZone(z.id)}
                    title="Apagar"
                  >
                    <Icon
                      icon="mdi:trash-can-outline"
                      width={18}
                      className="text-red-600"
                    />
                  </button>
                  <button
                    className="bg-blue-100 hover:bg-blue-200 p-1 rounded"
                    onClick={() => {
                      setEditZone(z);
                      setModalOpen(true);
                    }}
                    title="Editar"
                  >
                    <Icon
                      icon="mdi:pencil-outline"
                      width={18}
                      className="text-blue-600"
                    />
                  </button>
                </div>
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

        <div className="flex justify-end mt-6 w-full">
          <Button
            onClick={() => {
              setEditZone(null);
              setModalOpen(true);
            }}
            className="!w-40 !h-10"
            disabled={saving}
          >
            {saving ? "Salvando..." : "Adicionar zona"}
          </Button>
        </div>
      </div>

      <AddZoneModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditZone(null);
        }}
        onAdd={handleAddOrEditZone}
        editData={
          editZone
            ? { zone: editZone.zone, valor: editZone.deliveryFee }
            : undefined
        }
      />
    </div>
  );
}
