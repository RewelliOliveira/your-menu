import { useState, type FormEvent } from "react";
import { Copy, ExternalLink, Link2 } from "lucide-react";
import { toast } from "sonner";

import { ErrorState } from "@/components/shared/ErrorState";
import { Field } from "@/components/shared/Field";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { PageLoader } from "@/components/shared/PageLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAsync } from "@/hooks/use-async";
import { copyToClipboard, notifyError } from "@/lib/notify";
import { getHours, updateHours, updateProfile } from "@/services/restaurant-service";
import type { BusinessHours, Restaurant } from "@/types/restaurant";
import { useAdminRestaurant } from "../admin-restaurant-context";
import { BusinessHoursEditor } from "./BusinessHoursEditor";

export function ProfileSettingsPage() {
  const { data: hours, error, reload } = useAsync(getHours);
  const { restaurant } = useAdminRestaurant();

  if (error) return <ErrorState error={error} onRetry={() => reload()} />;
  if (!hours) return <PageLoader />;
  return <ProfileForm restaurant={restaurant} initialHours={hours} />;
}

function ProfileForm({ restaurant, initialHours }: { restaurant: Restaurant; initialHours: BusinessHours[] }) {
  const { setRestaurant } = useAdminRestaurant();
  const [form, setForm] = useState({
    name: restaurant.name,
    description: restaurant.description,
    logoUrl: restaurant.logoUrl,
    bannerUrl: restaurant.bannerUrl,
    deliveryTimeMin: String(restaurant.deliveryTimeMin),
    deliveryTimeMax: String(restaurant.deliveryTimeMax),
    pixKey: restaurant.pixKey,
  });
  const [hours, setHours] = useState(initialHours);
  const [saving, setSaving] = useState(false);
  const storefrontUrl = `${window.location.origin}/${restaurant.slug}`;

  const set = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const [updated] = await Promise.all([
        updateProfile({
          ...form,
          deliveryTimeMin: Number(form.deliveryTimeMin),
          deliveryTimeMax: Number(form.deliveryTimeMax),
        }),
        updateHours(hours),
      ]);
      setRestaurant(updated);
      toast.success("Perfil atualizado");
    } catch (error) {
      notifyError(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <Card className="overflow-hidden pt-0">
          <div className="relative">
            <ImageUpload
              value={form.bannerUrl}
              onChange={(url) => set("bannerUrl", url)}
              label="Adicionar capa"
              className="aspect-3/1 rounded-none border-0 border-b-2"
              maxSize={1600}
            />
            <ImageUpload
              value={form.logoUrl}
              onChange={(url) => set("logoUrl", url)}
              label="Logo"
              compact
              className="absolute -bottom-10 left-5 size-24 rounded-2xl border-4 border-solid border-card bg-muted shadow-md"
              maxSize={400}
            />
          </div>
          <CardContent className="grid gap-5 pt-10">
            <Field label="Nome do restaurante" htmlFor="name" required>
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={60} />
            </Field>
            <Field label="Descrição curta" htmlFor="description" hint="Aparece abaixo do nome na sua vitrine.">
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                maxLength={160}
                rows={2}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Tempo de entrega (min)" hint="Mínimo e máximo, em minutos.">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={form.deliveryTimeMin}
                    onChange={(e) => set("deliveryTimeMin", e.target.value)}
                    aria-label="Tempo mínimo de entrega"
                  />
                  <span className="text-sm text-muted-foreground">a</span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={form.deliveryTimeMax}
                    onChange={(e) => set("deliveryTimeMax", e.target.value)}
                    aria-label="Tempo máximo de entrega"
                  />
                </div>
              </Field>
              <Field label="Chave Pix" htmlFor="pix" hint="Deixe vazio para não aceitar Pix.">
                <Input
                  id="pix"
                  value={form.pixKey}
                  onChange={(e) => set("pixKey", e.target.value)}
                  placeholder="CNPJ, e-mail, telefone ou chave aleatória"
                  maxLength={77}
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horário de funcionamento</CardTitle>
            <CardDescription>Exibido na vitrine para seus clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <BusinessHoursEditor value={hours} onChange={setHours} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 lg:sticky lg:top-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="size-4 text-primary" /> Link do seu cardápio
            </CardTitle>
            <CardDescription>Compartilhe no WhatsApp, Instagram e Google.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="truncate rounded-xl bg-muted px-3 py-2.5 font-mono text-xs">{storefrontUrl}</p>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => copyToClipboard(storefrontUrl, "Link copiado!")}>
                <Copy /> Copiar
              </Button>
              <Button type="button" variant="outline" size="sm" asChild>
                <a href={storefrontUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink /> Abrir
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" loading={saving}>
          Salvar alterações
        </Button>
      </div>
    </form>
  );
}
