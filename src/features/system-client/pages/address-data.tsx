import { useDeliveryZones } from "@/hooks/useDeliveryZones";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";

export function AddressData() {
  const { zones, loading } = useDeliveryZones();
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const orderItems = order?.orderItems ?? [];
  const orderClient = order?.orderClient ?? {};

  const [form, setForm] = useState({
    street: "",
    number: "",
    zone: "",
    complement: "",
    cep: "",
    reference: "",
  });

  const [errors, setErrors] = useState<{ cep?: string }>({});
  const selectedZoneData = zones.find((z) => z.zone === form.zone);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const cleanedCep = form.cep.replace(/\D/g, "");

    if (cleanedCep.length !== 8) {
      setErrors({ cep: "O CEP deve conter exatamente 8 dígitos numéricos." });
      return;
    }

    setErrors({});

    const orderAdress = {
      street: form.street,
      number: form.number,
      complement: form.complement,
      cep: cleanedCep,
      reference: form.reference,
      deliveryZoneId: selectedZoneData?.id ?? 0,
    };

    localStorage.setItem("order_address", JSON.stringify(orderAdress));

    navigate("/finalize-order", {
      state: {
        orderItems,
        orderClient,
        orderAdress,
      },
    });
  };

  const isDisabled =
    !form.street.trim() ||
    !form.number.trim() ||
    !form.zone.trim() ||
    !form.complement.trim() ||
    !form.cep.trim() ||
    !form.reference.trim() ||
    loading;

  return (
    <section className="flex flex-col items-center justify-center w-full min-h-screen px-4 py-8 bg-white">
      <div className="flex flex-col w-full max-w-3xl p-6 bg-[#f5f5f5] rounded-lg border border-gray-400 shadow-md">
        <div className="flex items-center justify-center w-full mb-4">
          <h1 className="text-2xl font-bold">Dados de Endereço</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <Input
            label={
              <>
                Rua / Logradouro <span className="text-orange-600">*</span>
              </>
            }
            placeholder="Digite o nome da rua"
            size="full"
            value={form.street}
            onChange={(e) => handleChange("street", e.target.value)}
          />
          <Input
            label={
              <>
                Número <span className="text-orange-600">*</span>
              </>
            }
            placeholder="Digite o número"
            type="number"
            size="full"
            value={form.number}
            onChange={(e) => handleChange("number", e.target.value)}
          />

          <div className="flex gap-4">
            <div className="w-2/3">
              <Select
                label={
                  <>
                    Bairro <span className="text-orange-600">*</span>
                  </>
                }
                placeholder="Selecione um bairro"
                value={form.zone}
                onChange={(e) => handleChange("zone", e.target.value)}
                options={zones.map((z) => ({ value: z.zone, label: z.zone }))}
                disabled={loading}
                size="full"
              />
            </div>

            <div className="w-1/3">
              <Input
                label="Taxa"
                value={
                  selectedZoneData ? `R$ ${selectedZoneData.deliveryFee}` : ""
                }
                disabled
                size="full"
              />
            </div>
          </div>

          <Input
            label={
              <>
                Complemento <span className="text-orange-600">*</span>
              </>
            }
            placeholder="Digite o complemento"
            size="full"
            value={form.complement}
            onChange={(e) => handleChange("complement", e.target.value)}
          />
          <Input
            label={
              <>
                CEP <span className="text-orange-600">*</span>
              </>
            }
            placeholder="Digite o CEP"
            size="full"
            value={form.cep}
            onChange={(e) => handleChange("cep", e.target.value)}
            error={errors.cep}
          />
          <Input
            label={
              <>
                Referência <span className="text-orange-600">*</span>
              </>
            }
            placeholder="Digite um ponto de referência"
            size="full"
            value={form.reference}
            onChange={(e) => handleChange("reference", e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between w-full mt-6 gap-4">
          <Button
            type="submit"
            variant="dark"
            onClick={() => navigate("/personal-data")}
          >
            Voltar
          </Button>
          <Button type="submit" onClick={handleSave} disabled={isDisabled}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </section>
  );
}
