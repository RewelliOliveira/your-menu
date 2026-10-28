import { useState, type FormEvent } from "react";

import { CurrencyInput } from "@/components/shared/CurrencyInput";
import { Field } from "@/components/shared/Field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { parseCurrency, toCurrencyMask } from "@/lib/format";
import { getErrorMessage } from "@/lib/utils";
import { saveDeliveryZone } from "@/services/restaurant-service";
import type { DeliveryZone } from "@/types/restaurant";

interface ZoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zone: DeliveryZone | null;
  onSaved: (zone: DeliveryZone) => void;
}

export function ZoneDialog({ open, onOpenChange, zone, onSaved }: ZoneDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>{open && <ZoneForm zone={zone} onSaved={onSaved} onCancel={() => onOpenChange(false)} />}</DialogContent>
    </Dialog>
  );
}

function ZoneForm({ zone, onSaved, onCancel }: Pick<ZoneDialogProps, "zone" | "onSaved"> & { onCancel: () => void }) {
  const [name, setName] = useState(zone?.name ?? "");
  const [fee, setFee] = useState(zone ? toCurrencyMask(zone.fee) : "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      onSaved(await saveDeliveryZone({ id: zone?.id, name, fee: parseCurrency(fee) }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <DialogHeader>
        <DialogTitle>{zone ? "Editar bairro" : "Novo bairro atendido"}</DialogTitle>
        <DialogDescription>Defina a taxa cobrada para entregas nesta região.</DialogDescription>
      </DialogHeader>
      <Field label="Bairro ou região" htmlFor="zone-name">
        <Input id="zone-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoFocus />
      </Field>
      <Field label="Taxa de entrega" htmlFor="zone-fee" error={error} hint="Use 0,00 para entrega grátis.">
        <CurrencyInput id="zone-fee" value={fee} onValueChange={setFee} />
      </Field>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={saving} disabled={!name.trim()}>
          Salvar
        </Button>
      </DialogFooter>
    </form>
  );
}
