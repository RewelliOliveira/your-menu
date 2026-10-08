import { useDeliveryZones } from "@/app/hooks/use-delivery-zones";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { SimpleSelect } from "@/app/components/ui/Select";
import { formatCep } from "@/core/utils/utils";
import { toast } from "react-toastify";

export function AddressDataPage() {
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

  const selectedZoneData = zones.find((z) => z.zone === form.zone);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCepChange = (value: string) => {
    setForm((prev) => ({ ...prev, cep: formatCep(value) }));
  };

  const handleSave = () => {
    const cleanedCep = form.cep.replace(/\D/g, "");

    if (cleanedCep.length !== 8) {
      toast.warn("O CEP deve conter 8 dígitos.");
      return;
    }

    if (!form.street.trim() || !form.number.trim() || !form.zone) {
      toast.warn("Preencha todos os campos obrigatórios marcados com *.");
      return;
    }

    const orderAdress = {
      street: form.street,
      number: form.number,
      complement: form.complement,
      cep: cleanedCep,
      reference: form.reference,
      deliveryZoneId: Number(selectedZoneData?.id) || 1,
    };

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
    !form.cep.trim() ||
    loading;

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
      <div className="flex flex-col w-full max-w-2xl p-6 md:p-8 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="border-b pb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Endereço de Entrega</h1>
          <p className="text-xs text-gray-500 mt-1">
            Informe onde o motoboy deverá entregar o seu pedido
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label={
                <>
                  Rua / Logradouro <span className="text-orange-600">*</span>
                </>
              }
              placeholder="Digite o nome da sua rua"
              value={form.street}
              onChange={(e) => handleChange("street", e.target.value)}
            />
          </div>

          <div>
            <Input
              label={
                <>
                  Número <span className="text-orange-600">*</span>
                </>
              }
              placeholder="Ex: 120"
              value={form.number}
              onChange={(e) => handleChange("number", e.target.value)}
            />
          </div>

          <div>
            <Input
              label={
                <>
                  CEP <span className="text-orange-600">*</span>
                </>
              }
              placeholder="00000-000"
              value={form.cep}
              onChange={(e) => handleCepChange(e.target.value)}
            />
          </div>

          <div>
            <SimpleSelect
              label={
                <>
                  Bairro / Região <span className="text-orange-600">*</span>
                </>
              }
              placeholder="Selecione o bairro"
              value={form.zone}
              onChange={(val) => handleChange("zone", val)}
              options={zones.map((z) => ({ value: z.zone, label: z.zone }))}
              disabled={loading}
            />
          </div>

          <div>
            <Input
              label="Taxa de Entrega"
              value={
                selectedZoneData
                  ? `R$ ${selectedZoneData.deliveryFee.replace(".", ",")}`
                  : "Selecione o bairro"
              }
              disabled
            />
          </div>

          <div>
            <Input
              label="Complemento"
              placeholder="Ex: Apto 42, Bloco C"
              value={form.complement}
              onChange={(e) => handleChange("complement", e.target.value)}
            />
          </div>

          <div>
            <Input
              label="Ponto de Referência"
              placeholder="Ex: Próximo à padaria"
              value={form.reference}
              onChange={(e) => handleChange("reference", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/personal-data")}
          >
            ← Voltar
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isDisabled}
          >
            {loading ? "Carregando..." : "Finalizar Pedido →"}
          </Button>
        </div>
      </div>
    </section>
  );
}
