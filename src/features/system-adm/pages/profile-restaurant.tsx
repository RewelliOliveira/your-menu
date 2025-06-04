import { Input } from "@/components/ui/input";
import { Header } from "../components/header";
import { SelectDay } from "../components/ui/select-day";
import { TimerPicker } from "../components/ui/timer-picker";
import { BannerAdm } from "../components/ui/banner-adm";

export function ProfileRestaurant() {

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
