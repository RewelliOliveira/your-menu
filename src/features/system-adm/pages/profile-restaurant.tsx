import { Input } from "@/components/ui/input";
import { Header } from "../components/header";
import { SelectDay } from "../components/ui/select-day";
import { TimerPicker } from "../components/ui/timer-picker";
import { BannerAdm } from "../components/ui/banner-adm";
import { useEffect, useState } from "react";
import { restaurantProfileApi } from "@/services/restaurant-profile";
import { useAuth } from "@/contexts/auth-context";
import { DeliveryInput } from "../components/ui/delivey-input";
import { WeekDays } from "@/constants/week-days";
import { Button } from "../components/ui/button";
import { AddZoneModal } from "../components/ui/add-zone-modal";
import { getDeliveryZones, saveDeliveryZone } from "@/services/delivery-zone";

export function ProfileRestaurant() {
  const [name, setName] = useState('');
  const [deliveryTimeMin, setDeliveryTimeMin] = useState("");
  const [deliveryTimeMax, setDeliveryTimeMax] = useState("");
  const { token } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zones, setZones] = useState<{ local: string; valor: string }[]>([]);

  const restaurantSlug = "delicias-do-rancho";

  useEffect(() => {
    async function fetchZones() {
      if (!token) return;

      try {
        const data = await getDeliveryZones(restaurantSlug, token);
        setZones(data.map((item: any) => ({
          local: item.zone,
          valor: item.deliveryFee.toFixed(2).replace('.', ',')
        })));
      } catch (error) {
        console.error("Erro ao buscar zonas:", error);
        alert("Erro ao carregar zonas de entrega.");
      }
    }

    fetchZones();
  }, [token]);

  const handleAddZone = async (zone: string, valor: string) => {
    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }

    try {
      const payload = {
        zone,
        deliveryFee: parseFloat(valor.replace(',', '.')),
        restaurantSlug,
      };

      await saveDeliveryZone(payload, token);

      setZones(prev => [...prev, { local: zone, valor }]);
      alert("Zona adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar zona:", error);
      alert("Erro ao adicionar zona.");
    }
  };

  const handleSubmit = async () => {
    if (!name || !deliveryTimeMin || !deliveryTimeMax) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }

    try {
      const data = {
        name,
        deliveryTimeMin: parseInt(deliveryTimeMin),
        deliveryTimeMax: parseInt(deliveryTimeMax)
      };

      await restaurantProfileApi(data, token);
      alert("Restaurante cadastrado!");
    } catch (error) {
      console.error("Erro ao salvar restaurante:", error);
      alert("Erro ao salvar restaurante.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <BannerAdm />

      <main className="flex-grow flex justify-center items-start py-8">
        <div className="w-full max-w-[75%] space-y-12 px-4">
          <Section title="Informações gerais">
            <div className="flex flex-col gap-8">
              <Input label="Nome do restaurante*" type="text" className="w-2xl" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </Section>

          <Section title="Funcionamento">
            <div className="w-100">
              <div className="w-full mb-1.5">
                <label htmlFor="Periodo de funcionamento">Dias de funcionamento*:</label>
              </div>
              <div className="flex items-center justify-between gap-5">
                <div className="w-full">
                  <SelectDay options={WeekDays} />
                </div>
                <div className="w-full">
                  <SelectDay options={WeekDays} />
                </div>
              </div>
              <div className="flex flex-col gap-8 mt-8">
                <TimerPicker label="Horário de funcionamento*" />
                <DeliveryInput
                  label="Intervalo de entrega*"
                  deliveryTimeMin={deliveryTimeMin}
                  deliveryTimeMax={deliveryTimeMax}
                  onChangeMin={setDeliveryTimeMin}
                  onChangeMax={setDeliveryTimeMax}
                />
              </div>
            </div>
          </Section>

          <Section title="Taxa de entrega">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                <strong>Atenção:</strong> para que clientes consigam selecionar um local de entrega, é necessário que o responsável pelo estabelecimento tenha cadastrado as zonas de entrega com seus valores. Indicamos que sejam cadastrados os diferentes bairros de entrega disponíveis.
              </p>

              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Local</th>
                    <th className="px-4 py-2 border-b text-left">Valor R$</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{zone.local}</td>
                      <td className="px-4 py-2 border-b">{zone.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Button
                className="max-w-40 !bg-[#00B37E] hover:!bg-[#00875F] text-white"
                onClick={() => setIsModalOpen(true)}
              >
                Adicionar zona
              </Button>
            </div>
          </Section>
        </div>
      </main>

      <footer className="flex justify-center bg-black/5">
        <div className="flex justify-between w-full max-w-[75%] py-5">
          <Button className="max-w-40 bg-transparent text-black border border-black hover:text-white hover:border-white">Copiar Link</Button>
          <Button className="max-w-40" onClick={handleSubmit}>Salvar</Button>
        </div>
      </footer>

      <AddZoneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddZone}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-gray-700">{title}</h3>
      {children}
    </section>
  );
}
