import { useState, type FormEvent } from "react";

import { CurrencyInput } from "@/components/shared/CurrencyInput";
import { Field } from "@/components/shared/Field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseCurrency, toCurrencyMask } from "@/lib/format";
import { toDateKey } from "@/lib/month";
import { getErrorMessage } from "@/lib/utils";
import { saveTransaction } from "@/services/finance-service";
import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPE_LABEL,
  type Transaction,
  type TransactionType,
} from "@/types/finance";
import { SegmentedControl } from "./SegmentedControl";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  defaultDate: string;
  onSaved: () => void;
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  defaultDate,
  onSaved,
}: TransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && (
          <TransactionForm
            transaction={transaction}
            defaultDate={defaultDate}
            onSaved={onSaved}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TransactionForm({
  transaction,
  defaultDate,
  onSaved,
  onCancel,
}: Omit<TransactionDialogProps, "open" | "onOpenChange"> & {
  onCancel: () => void;
}) {
  const [type, setType] = useState<TransactionType>(
    transaction?.type ?? "EXPENSE",
  );
  const [category, setCategory] = useState(transaction?.category ?? "");
  const [description, setDescription] = useState(
    transaction?.description ?? "",
  );
  const [amount, setAmount] = useState(
    transaction ? toCurrencyMask(transaction.amount) : "",
  );
  const [date, setDate] = useState(transaction?.date ?? defaultDate);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function changeType(next: TransactionType) {
    setType(next);
    if (!TRANSACTION_CATEGORIES[next].includes(category)) setCategory("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!category) {
      setError("Selecione uma categoria.");
      return;
    }
    setSaving(true);
    try {
      await saveTransaction({
        id: transaction?.id,
        type,
        category,
        description,
        amount: parseCurrency(amount),
        date,
      });
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
      <DialogHeader>
        <DialogTitle>
          {transaction ? "Editar movimentação" : "Nova movimentação"}
        </DialogTitle>
        <DialogDescription>
          Registre entradas extras, despesas e perdas para manter o caixa em
          dia.
        </DialogDescription>
      </DialogHeader>

      <SegmentedControl
        label="Tipo de movimentação"
        value={type}
        onChange={changeType}
        className="w-full [&>button]:flex-1 [&>button]:py-2 [&>button]:text-sm"
        options={(Object.keys(TRANSACTION_TYPE_LABEL) as TransactionType[]).map(
          (value) => ({
            value,
            label: TRANSACTION_TYPE_LABEL[value],
          }),
        )}
      />

      <Field label="Descrição" htmlFor="tx-description" required>
        <Input
          id="tx-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex.: Compra de carne no atacado"
          maxLength={80}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Categoria" required>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger aria-label="Categoria">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_CATEGORIES[type].map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Valor" htmlFor="tx-amount" required>
          <CurrencyInput
            id="tx-amount"
            value={amount}
            onValueChange={setAmount}
          />
        </Field>
      </div>

      <Field label="Data" htmlFor="tx-date" error={error} required>
        <Input
          id="tx-date"
          type="date"
          value={date}
          max={toDateKey(new Date())}
          onChange={(e) => setDate(e.target.value)}
        />
      </Field>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={saving}>
          Salvar
        </Button>
      </DialogFooter>
    </form>
  );
}
