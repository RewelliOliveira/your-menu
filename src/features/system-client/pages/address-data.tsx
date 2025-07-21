import { useDeliveryZones } from "@/hooks/useDeliveryZones";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";

export function AddressData() {
  const { zones, loading } = useDeliveryZones();

  const [selectedZone, setSelectedZone] = useState("");

  const selectedZoneData = zones.find((z) => z.zone === selectedZone);

  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center justify-center w-full min-h-screen px-4 py-8 bg-white">
      <div className="flex flex-col w-full max-w-3xl p-6 bg-[#f5f5f5] rounded-lg border border-gray-400 shadow-md">
        <div className="flex items-center justify-center w-full mb-4">
          <h1 className="text-2xl font-bold">Dados de Endereço</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <Input
            label="Rua / Logradouro"
            placeholder="Digite o nome da rua"
            size="full"
          />
          <Input
            label="Número"
            placeholder="Digite o número"
            type="number"
            size="full"
          />

          {/* Bairro e Taxa de entrega lado a lado */}
          <div className="flex gap-4">
            <div className="w-2/3">
              <Select
                label={
                  <span className="text-sm font-medium text-black">Bairro</span>
                }
                placeholder="Selecione um bairro"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
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
            label="Complemento"
            placeholder="Digite o complemento"
            size="full"
          />
          <Input label="CEP" placeholder="Digite o CEP" size="full" />
          <Input
            label="Ponto de referência"
            placeholder="Digite um ponto de referência"
            size="full"
          />
        </div>

        <div className="flex items-center justify-between w-full mt-6 gap-4">
          <Button type="submit" variant="dark" onClick={() => {}}>
            Voltar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </div>
    </section>
  );
}
