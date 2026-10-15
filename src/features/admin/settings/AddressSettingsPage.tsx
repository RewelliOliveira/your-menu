import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ErrorState } from "@/components/shared/ErrorState";
import { Field } from "@/components/shared/Field";
import { PageLoader } from "@/components/shared/PageLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAsync } from "@/hooks/use-async";
import { useCepAutofill } from "@/hooks/use-cep-autofill";
import { maskCep } from "@/lib/format";
import { notifyError } from "@/lib/notify";
import { getAddress, updateAddress } from "@/services/restaurant-service";
import type { RestaurantAddress } from "@/types/restaurant";

export function AddressSettingsPage() {
  const { data, error, reload } = useAsync(getAddress);
  if (error) return <ErrorState error={error} onRetry={() => reload()} />;
  if (!data) return <PageLoader />;
  return <AddressForm initial={data} />;
}

function AddressForm({ initial }: { initial: RestaurantAddress }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const set = (field: keyof RestaurantAddress) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const searchingCep = useCepAutofill(form.cep, (result) => setForm((prev) => ({ ...prev, ...result })));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await updateAddress(form);
      toast.success("Endereço salvo");
    } catch (error) {
      notifyError(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Endereço do estabelecimento</CardTitle>
          <CardDescription>Usado para retiradas no balcão e exibido aos clientes.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-6">
          <Field label="CEP" htmlFor="cep" className="sm:col-span-2" required>
            <div className="relative">
              <Input
                id="cep"
                inputMode="numeric"
                value={form.cep}
                onChange={(e) => setForm((prev) => ({ ...prev, cep: maskCep(e.target.value) }))}
                placeholder="00000-000"
              />
              {searchingCep && (
                <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
          </Field>
          <Field label="Rua" htmlFor="street" className="sm:col-span-4" required>
            <Input id="street" value={form.street} onChange={set("street")} maxLength={120} />
          </Field>
          <Field label="Número" htmlFor="number" className="sm:col-span-2" required>
            <Input id="number" value={form.number} onChange={set("number")} maxLength={10} />
          </Field>
          <Field label="Complemento" htmlFor="complement" className="sm:col-span-4">
            <Input id="complement" value={form.complement} onChange={set("complement")} maxLength={60} />
          </Field>
          <Field label="Bairro" htmlFor="district" className="sm:col-span-2" required>
            <Input id="district" value={form.district} onChange={set("district")} maxLength={60} />
          </Field>
          <Field label="Cidade" htmlFor="city" className="sm:col-span-3" required>
            <Input id="city" value={form.city} onChange={set("city")} maxLength={60} />
          </Field>
          <Field label="UF" htmlFor="state" className="sm:col-span-1" required>
            <Input id="state" value={form.state} onChange={set("state")} maxLength={2} className="uppercase" />
          </Field>
          <Field label="Ponto de referência" htmlFor="reference" className="sm:col-span-6">
            <Input id="reference" value={form.reference} onChange={set("reference")} maxLength={120} />
          </Field>
          <div className="flex justify-end sm:col-span-6">
            <Button type="submit" size="lg" loading={saving} className="w-full sm:w-auto">
              Salvar endereço
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
