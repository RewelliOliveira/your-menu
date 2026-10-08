import { useState, useEffect } from "react";
import { Header } from "@/app/components/layout/Header";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/hooks/use-auth";
import { formatCep } from "@/core/utils/utils";
import {
  getRestaurantAddressApi,
  getRestaurantProfileApi,
  saveRestaurantAddressApi,
  updateRestaurantAddressApi,
} from "@/infrastructure/services/restaurant-service";

export function RestaurantAddressPage() {
  const [cep, setCep] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [complement, setComplement] = useState("");
  const [reference, setReference] = useState("");
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [hasAddress, setHasAddress] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { token, updateRestaurantId } = useAuth();

  useEffect(() => {
    async function fetchRestaurantId() {
      if (!token) return;
      try {
        const restaurant = await getRestaurantProfileApi(token);
        setRestaurantId(restaurant.id);
        updateRestaurantId(restaurant.id);
      } catch (error) {
        console.error("Erro ao buscar o perfil do restaurante:", error);
      }
    }
    fetchRestaurantId();
  }, [token, updateRestaurantId]);

  useEffect(() => {
    async function fetchAddress() {
      if (!restaurantId || !token) return;

      try {
        const address = await getRestaurantAddressApi(restaurantId, token);

        setHasAddress(true);
        setCep(formatCep(address.cep.toString()));
        setState(address.state);
        setCity(address.city);
        setStreet(address.street);
        setNumber(address.number.toString());
        setDistrict(address.district);
        setComplement(address.complement ?? "");
        setReference(address.reference ?? "");
      } catch {
        setHasAddress(false);
      }
    }

    fetchAddress();
  }, [restaurantId, token]);

  const handleSubmit = async () => {
    if (!cep || !state || !city || !street || !number || !district) {
      toast.warn("Preencha todos os campos obrigatórios marcados com *");
      return;
    }

    if (!token) {
      toast.error("Usuário não autenticado");
      return;
    }

    if (!restaurantId) {
      toast.error("ID do restaurante não disponível.");
      return;
    }

    const data = {
      restaurantId,
      cep,
      state,
      city,
      street,
      number: parseInt(number, 10) || 0,
      district,
      complement: complement || null,
      reference: reference || null,
    };

    try {
      setSaving(true);
      if (hasAddress) {
        await updateRestaurantAddressApi(data, token);
        toast.success("Endereço atualizado com sucesso!");
      } else {
        await saveRestaurantAddressApi(data, token);
        toast.success("Endereço cadastrado com sucesso!");
        setHasAddress(true);
      }
      navigate("/adm/restaurant-delivery");
    } catch {
      toast.error("Erro ao salvar endereço.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#f5f5f5] min-h-screen pb-16">
      <Header isAdmin={true} />

      <main className="max-w-4xl w-full mx-auto p-4 md:p-6 mt-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="border-b pb-3">
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              Informações de Endereço do Estabelecimento
            </h1>
            <p className="text-xs text-gray-500 text-center mt-1">
              Endereço físico para retirada de pedidos e cálculo de rotas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="CEP *"
              placeholder="00000-000"
              value={cep}
              onChange={(e) => setCep(formatCep(e.target.value))}
            />
            <Input
              label="Estado (UF) *"
              placeholder="Ex: SP"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Cidade *"
              placeholder="Ex: São Paulo"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              label="Bairro *"
              placeholder="Ex: Bela Vista"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Rua / Logradouro *"
                placeholder="Ex: Avenida Paulista"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Número *"
                placeholder="Ex: 1000"
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Complemento"
              placeholder="Ex: Sala 42, Bloco B"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
            />
            <Input
              label="Ponto de Referência"
              placeholder="Ex: Próximo ao metrô"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => navigate("/adm/profile-restaurant")}
              type="button"
            >
              Voltar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              type="button"
            >
              {saving ? "Salvando..." : "Salvar Endereço"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
