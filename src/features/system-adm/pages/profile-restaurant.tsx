import { Input } from "@/components/ui/input";
import { Header } from "../components/header";
import { SelectDay } from "../components/ui/select-day";
import { TimerPicker } from "../components/ui/timer-picker";
import { useState } from "react";
import { restaurantAdress } from "@/services/adress-account";
import { BannerAdm } from "../components/ui/banner-adm";

export function ProfileRestaurant() {
  const [cep, setCep] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [complement, setComplement] = useState("");
  const [reference, setReference] = useState("");


  const handleSubmit = async () => {
    if (!cep || !state || !city || !street || !number || !district) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const data = {
        restaurantId: "123456", // substitua com ID real, ou use estado/contexto
        cep: parseInt(cep),
        state,
        city,
        street,
        number: parseInt(number),
        district,
        complement: complement || null,
        reference: reference || null,
      };

      await restaurantAdress(data);
      alert("Endereço salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
      alert("Erro ao salvar endereço.");
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
              <Input label="Nome do restaurante*" type="text" className="w-2xl" />
              <Input label="Descrição" type="text" />
            </div>
          </Section>

          <Section title="Funcionamento">
            <div className="w-100">
              <div className="flex">
                <SelectDay />
                <SelectDay />
              </div>
              <div className="flex flex-col gap-8 mt-4">
                <TimerPicker label="Horário de funcionamento*" />
                <TimerPicker label="Tempo de entrega estimado*" />
              </div>
            </div>
          </Section>
          <Section title="Endereço">
            <div className="flex gap-8">
              <Input label="CEP*" type="text" value={cep} onChange={(e) => setCep(e.target.value)} />
              <Input label="Estado*" type="text" value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <div className="flex gap-8 mt-4">
              <Input label="Cidade*" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
              <Input label="Bairro*" type="text" value={district} onChange={(e) => setDistrict(e.target.value)} />
            </div>
            <div className="flex gap-8 mt-4">
              <Input label="Rua*" type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
              <Input label="Número*" type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
            </div>
            <div className="flex gap-8 mt-4">
              <Input label="Complemento" type="text" value={complement} onChange={(e) => setComplement(e.target.value)} />
              <Input label="Referência" type="text" value={reference} onChange={(e) => setReference(e.target.value)} />
            </div>

            <button
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Salvar endereço
            </button>
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
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">Centro</td>
                    <td className="px-4 py-2 border-b">Ocara</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {children}
    </section>
  );
}
