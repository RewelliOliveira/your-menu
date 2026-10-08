import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/app/components/layout/Header";
import { BannerAdm } from "../components/BannerAdm";
import { Input } from "@/app/components/ui/Input";
import { SimpleSelect } from "@/app/components/ui/Select";
import { TimerPicker } from "../components/TimerPicker";
import { DeliveryInput } from "../components/DeliveryInput";
import { Button } from "@/app/components/ui/Button";
import { useAuth } from "@/app/hooks/use-auth";
import { useRestaurant } from "@/app/hooks/use-restaurant";
import { useProfileForm } from "@/app/hooks/use-profile-form";
import { WEEK_DAYS } from "@/core/constants/week-days";
import {
  getRestaurantLinkApi,
  getRestaurantProfileApi,
  updateRestaurantProfileApi,
  restaurantProfileApi,
  getRestaurantHoursApi,
  restaurantHoursApi,
} from "@/infrastructure/services/restaurant-service";
import { toast } from "react-toastify";

export function ProfileRestaurantPage() {
  const navigate = useNavigate();
  const { token, updateRestaurantId } = useAuth();
  const { setSlug } = useRestaurant();

  const {
    name,
    setName,
    weekdayStart,
    setWeekdayStart,
    weekdayEnd,
    setWeekdayEnd,
    openingTime,
    setOpeningTime,
    closingTime,
    setClosingTime,
    deliveryTimeMin,
    setDeliveryTimeMin,
    deliveryTimeMax,
    setDeliveryTimeMax,
    profilePicFile,
    setProfilePicFile,
    bannerPicFile,
    setBannerPicFile,
    profilePicUrl,
    setProfilePicUrl,
    bannerPicUrl,
    setBannerPicUrl,
  } = useProfileForm();

  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const profileData = await getRestaurantProfileApi(token);

        setRestaurantId(profileData.id);
        setName(profileData.name);
        setDeliveryTimeMin(String(profileData.deliveryTimeMin));
        setDeliveryTimeMax(String(profileData.deliveryTimeMax));
        setProfilePicUrl(profileData.profilePicUrl);
        setBannerPicUrl(profileData.bannerPicUrl);

        if (profileData.slug) {
          setSlug(profileData.slug);
        }

        if (profileData.id) {
          const hoursData = await getRestaurantHoursApi(profileData.id, token);
          const openDays = hoursData.filter(
            (day) => day.openingTime !== null && day.closingTime !== null
          );

          const orderWeek = [
            "SUNDAY",
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
          ];
          openDays.sort(
            (a, b) => orderWeek.indexOf(a.weekday) - orderWeek.indexOf(b.weekday)
          );

          if (openDays.length > 0) {
            setWeekdayStart(openDays[0].weekday);
            setWeekdayEnd(openDays[openDays.length - 1].weekday);
            setOpeningTime(openDays[0].openingTime ? openDays[0].openingTime.slice(0, 5) : "");
            setClosingTime(openDays[0].closingTime ? openDays[0].closingTime.slice(0, 5) : "");
          } else {
            setWeekdayStart("MONDAY");
            setWeekdayEnd("FRIDAY");
            setOpeningTime("18:00");
            setClosingTime("23:30");
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do restaurante:", error);
      }
    };

    fetchData();
  }, [
    token,
    setName,
    setDeliveryTimeMin,
    setDeliveryTimeMax,
    setProfilePicUrl,
    setBannerPicUrl,
    setWeekdayStart,
    setWeekdayEnd,
    setOpeningTime,
    setClosingTime,
    setSlug,
  ]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.warn("Informe o nome do restaurante");
      return;
    }

    if (!weekdayStart || !weekdayEnd) {
      toast.warn("Selecione os dias de funcionamento");
      return;
    }

    try {
      setIsSaving(true);
      let currentRestaurantId = restaurantId;

      const profilePayload = {
        name,
        deliveryTimeMin: Number(deliveryTimeMin) || 30,
        deliveryTimeMax: Number(deliveryTimeMax) || 45,
        profilePicFile,
        bannerPicFile,
      };

      if (!currentRestaurantId) {
        const created = await restaurantProfileApi(profilePayload, token || undefined);
        currentRestaurantId = created.id;
        updateRestaurantId(currentRestaurantId);
        setSlug(created.slug);
        toast.success("Restaurante criado com sucesso!");
      } else {
        const updated = await updateRestaurantProfileApi(
          currentRestaurantId,
          profilePayload,
          token || undefined
        );
        setSlug(updated.slug);
        toast.success("Dados do restaurante atualizados!");
      }

      await restaurantHoursApi(
        currentRestaurantId,
        {
          weekday_start: weekdayStart,
          weekday_end: weekdayEnd,
          openingTime: openingTime || "18:00",
          closingTime: closingTime || "23:30",
        },
        token || undefined
      );

      navigate("/adm/restaurant-adress");
    } catch {
      toast.error("Erro ao salvar restaurante ou horários.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = async () => {
    if (!restaurantId) {
      toast.error("Restaurante não encontrado!");
      return;
    }

    try {
      const { link } = await getRestaurantLinkApi(restaurantId, token || undefined);
      await navigator.clipboard.writeText(link);
      toast.success("Link do cardápio copiado para a área de transferência!");
    } catch {
      toast.info("Link copiado!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20">
      <Header isAdmin={true} />
      <BannerAdm
        profilePicFile={profilePicFile}
        bannerPicFile={bannerPicFile}
        profilePicUrl={profilePicUrl}
        bannerPicUrl={bannerPicUrl}
        setProfilePicFile={setProfilePicFile}
        setBannerPicFile={setBannerPicFile}
      />

      <main className="flex-grow max-w-4xl w-full mx-auto p-4 md:p-6 space-y-8">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
            1. Informações Gerais
          </h2>
          <Input
            label="Nome do restaurante *"
            placeholder="Ex: YourBurger Artesanal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
            2. Dias e Horários de Funcionamento
          </h2>

          <div className="space-y-4">
            <span className="text-sm font-semibold text-gray-800 block">
              Período da Semana *
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SimpleSelect
                label="De:"
                options={WEEK_DAYS}
                value={weekdayStart}
                onChange={setWeekdayStart}
              />
              <SimpleSelect
                label="Até:"
                options={WEEK_DAYS}
                value={weekdayEnd}
                onChange={setWeekdayEnd}
              />
            </div>
          </div>

          <div className="border-t pt-4 space-y-6">
            <TimerPicker
              label="Horário de Funcionamento *"
              valueStart={openingTime}
              valueEnd={closingTime}
              onChangeStart={setOpeningTime}
              onChangeEnd={setClosingTime}
            />

            <DeliveryInput
              label="Tempo Estimado de Entrega (em minutos) *"
              deliveryTimeMin={deliveryTimeMin}
              deliveryTimeMax={deliveryTimeMax}
              onChangeMin={setDeliveryTimeMin}
              onChangeMax={setDeliveryTimeMax}
            />
          </div>
        </section>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <Button
            variant="outline"
            onClick={handleCopyLink}
            type="button"
          >
            Copiar Link do Cardápio
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            type="button"
          >
            {isSaving ? "Salvando..." : "Salvar e Avançar"}
          </Button>
        </div>
      </main>
    </div>
  );
}
