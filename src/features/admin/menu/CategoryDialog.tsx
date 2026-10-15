import { useState, type FormEvent } from "react";

import { Field } from "@/components/shared/Field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils";
import { saveCategory } from "@/services/menu-service";
import type { Category } from "@/types/menu";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSaved: (category: Category) => void;
}

export function CategoryDialog({ open, onOpenChange, category, onSaved }: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {open && <CategoryForm category={category} onSaved={onSaved} onCancel={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function CategoryForm({ category, onSaved, onCancel }: Omit<CategoryDialogProps, "open" | "onOpenChange"> & { onCancel: () => void }) {
  const [name, setName] = useState(category?.name ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      onSaved(await saveCategory({ id: category?.id, name }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <DialogHeader>
        <DialogTitle>{category ? "Renomear categoria" : "Nova categoria"}</DialogTitle>
        <DialogDescription>Categorias organizam o cardápio em seções, como "Lanches" ou "Bebidas".</DialogDescription>
      </DialogHeader>
      <Field label="Nome" htmlFor="category-name" error={error}>
        <Input
          id="category-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Porções"
          maxLength={40}
          autoFocus
          aria-invalid={!!error}
        />
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
