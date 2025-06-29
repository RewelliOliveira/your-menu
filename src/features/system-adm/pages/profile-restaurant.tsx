import { Input } from "@/components/ui/input";
import { Header } from "../components/header";
import { SelectDay } from "../components/ui/select-day";
import { TimerPicker } from "../components/ui/timer-picker";
import { BannerAdm } from "../components/ui/banner-adm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { DeliveryInput } from "../components/ui/delivey-input";
import { WeekDays } from "@/constants/week-days"
import { Button } from "../components/ui/button";
import { useProfileForm } from "@/hooks/useProfileForm";
import { submitRestaurantProfile } from "@/utils/submitRestaurantProfile";

export function ProfileRestaurant() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const {
    name, setName,
    weekdayStart, setWeekdayStart,
    weekdayEnd, setWeekdayEnd,
    openingTime, setOpeningTime,
    closingTime, setClosingTime,
    deliveryTimeMin, setDeliveryTimeMin,
    deliveryTimeMax, setDeliveryTimeMax,
    profilePicFile, setProfilePicFile,
    bannerPicFile, setBannerPicFile,
  } = useProfileForm();

  const handleSubmit = async () => {
    try {
      if (!token) {
        alert("Usuário não autenticado.");
        return;
      }

      await submitRestaurantProfile({
        name,
        deliveryTimeMin,
        deliveryTimeMax,
        profilePicFile,
        bannerPicFile,
        weekdayStart,
        weekdayEnd,
        openingTime,
        closingTime,
        token,
      });

      alert("Restaurante cadastrado com horários!");
      navigate("/edit-menu");
    } catch (error: any) {
      alert(error.message || "Erro ao salvar restaurante ou horários.");
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
                  <SelectDay options={WeekDays} value={weekdayStart} onChange={setWeekdayStart} />
                </div>
                <div className="w-full">
                  <SelectDay options={WeekDays} value={weekdayEnd} onChange={setWeekdayEnd} />
                </div>
              </div>
              <div className="flex flex-col gap-8 mt-8">
                <TimerPicker
                  label="Horário de funcionamento*"
                  valueStart={openingTime}
                  valueEnd={closingTime}
                  onChangeStart={setOpeningTime}
                  onChangeEnd={setClosingTime}
                />

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
