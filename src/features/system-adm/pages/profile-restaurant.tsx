import { Input } from "@/components/ui/input";
import { Header } from "../components/header";
import { SelectDay } from "../components/ui/select-day";
import { TimerPicker } from "../components/ui/timer-picker";
import { BannerAdm } from "../components/ui/banner-adm";
import { useState } from "react";
import { restaurantProfileApi } from "@/services/restaurant-profile-api";
import { useAuth } from "@/contexts/auth-context";
import { DeliveryInput } from "../components/ui/delivey-input";
import { WeekDays } from "@/constants/week-days"
import { Button } from "../components/ui/button";

export function ProfileRestaurant() {
  const [name, setName] = useState('');
  const [deliveryTimeMin, setDeliveryTimeMin] = useState("");
  const [deliveryTimeMax, setDeliveryTimeMax] = useState("");
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [bannerPicFile, setBannerPicFile] = useState<File | null>(null);

  const { token } = useAuth();

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
        deliveryTimeMax: parseInt(deliveryTimeMax),
        profilePicFile,
        bannerPicFile,
      };

      console.log("🔍 Dados preparados para envio:");
      console.log("Nome:", data.name);
      console.log("Tempo de entrega:", data.deliveryTimeMin, "-", data.deliveryTimeMax);
      console.log("Arquivo de perfil:", data.profilePicFile);
      console.log("Arquivo de banner:", data.bannerPicFile);

      const response = await restaurantProfileApi(data, token);

      console.log("✅ Resposta da API:", response);
      console.log("ID do restaurante cadastrado:", response.id);

      alert("Restaurante cadastrado!");
    } catch (error) {
      console.error("❌ Erro ao salvar restaurante:", error);
      alert("Erro ao salvar restaurante.");
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <BannerAdm
        profilePicFile={profilePicFile}
        bannerPicFile={bannerPicFile}
        setProfilePicFile={setProfilePicFile}
        setBannerPicFile={setBannerPicFile}
      />


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
        </div>
      </main>

      <footer className="flex justify-center bg-black/5">
        <div className="flex justify-between w-full max-w-[75%] py-5">
          <Button className="max-w-40 bg-transparent text-black border border-black hover:text-white hover:border-white">Copiar Link</Button>
          <Button className="max-w-40" onClick={handleSubmit}>Salvar</Button>
        </div>
      </footer>
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
