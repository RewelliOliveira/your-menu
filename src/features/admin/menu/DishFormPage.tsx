import { useCallback, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { CurrencyInput } from "@/components/shared/CurrencyInput";
import { DishCard } from "@/components/shared/DishCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Field } from "@/components/shared/Field";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { PageLoader } from "@/components/shared/PageLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAsync } from "@/hooks/use-async";
import { parseCurrency, toCurrencyMask } from "@/lib/format";
import { notifyError } from "@/lib/notify";
import { createId } from "@/lib/utils";
import { getCategories, getDish, saveDish } from "@/services/menu-service";
import type { Category, Dish } from "@/types/menu";

interface VariantDraft {
  key: string;
  id: string;
  label: string;
  price: string;
}

interface DishDraft {
  name: string;
  description: string;
  categoryId: string;
  imageUrl: string | null;
  isAvailable: boolean;
  variants: VariantDraft[];
}

const DESCRIPTION_LIMIT = 300;

function toDraft(dish: Dish | null, defaultCategoryId: string): DishDraft {
  return {
    name: dish?.name ?? "",
    description: dish?.description ?? "",
    categoryId: dish?.categoryId ?? defaultCategoryId,
    imageUrl: dish?.imageUrl ?? null,
    isAvailable: dish?.isAvailable ?? true,
    variants: dish?.variants.map((v) => ({ key: v.id, id: v.id, label: v.label, price: toCurrencyMask(v.price) })) ?? [
      { key: createId(), id: "", label: "Individual", price: "" },
    ],
  };
}

export function DishFormPage() {
  const { dishId } = useParams();
  const [searchParams] = useSearchParams();

  const fetcher = useCallback(
    () => Promise.all([getCategories(), dishId ? getDish(dishId) : Promise.resolve(null)]),
    [dishId],
  );
  const { data, error, reload } = useAsync(fetcher);

  if (error) return <ErrorState error={error} onRetry={() => reload()} />;
  if (!data) return <PageLoader />;

  const [categories, dish] = data;
  const requestedCategory = searchParams.get("category");
  const defaultCategory = categories.some((c) => c.id === requestedCategory) ? requestedCategory! : (categories[0]?.id ?? "");

  return <DishForm key={dish?.id ?? "new"} categories={categories} dish={dish} initial={toDraft(dish, defaultCategory)} />;
}

function DishForm({ categories, dish, initial }: { categories: Category[]; dish: Dish | null; initial: DishDraft }) {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<"name" | "categoryId" | "variants", string>>>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof DishDraft>(field: K, value: DishDraft[K]) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateVariant = (key: string, patch: Partial<VariantDraft>) =>
    set("variants", draft.variants.map((v) => (v.key === key ? { ...v, ...patch } : v)));

  const previewVariants = draft.variants
    .map((v) => ({ id: v.id, label: v.label, price: parseCurrency(v.price) }))
    .filter((v) => v.price > 0);

  function validate() {
    const next: typeof errors = {};
    if (draft.name.trim().length < 2) next.name = "Informe o nome do prato.";
    if (!draft.categoryId) next.categoryId = "Selecione uma categoria.";
    if (!draft.variants.length || draft.variants.some((v) => !v.label.trim() || parseCurrency(v.price) <= 0)) {
      next.variants = "Cada opção precisa de um nome e de um preço maior que zero.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await saveDish({
        id: dish?.id,
        name: draft.name,
        description: draft.description,
        categoryId: draft.categoryId,
        imageUrl: draft.imageUrl,
        isAvailable: draft.isAvailable,
        variants: draft.variants.map((v) => ({ id: v.id, label: v.label, price: parseCurrency(v.price) })),
      });
      toast.success(dish ? "Prato atualizado" : "Prato criado");
      navigate("/admin/menu");
    } catch (error) {
      notifyError(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/menu" aria-label="Voltar ao cardápio">
            <ArrowLeft />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{dish ? "Editar prato" : "Novo prato"}</h1>
          <p className="text-sm text-muted-foreground">Capriche na foto e na descrição: é o que faz o cliente pedir.</p>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <Field label="Nome" htmlFor="dish-name" error={errors.name} required>
                <Input
                  id="dish-name"
                  value={draft.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Ex.: Smash Burger Clássico"
                  maxLength={80}
                  aria-invalid={!!errors.name}
                />
              </Field>

              <Field
                label="Descrição"
                htmlFor="dish-description"
                hint={`${draft.description.length}/${DESCRIPTION_LIMIT} · Ingredientes, tamanho da porção, diferenciais.`}
              >
                <Textarea
                  id="dish-description"
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Pão brioche, blend 160g, cheddar inglês e molho da casa."
                  maxLength={DESCRIPTION_LIMIT}
                  rows={3}
                />
              </Field>

              <Field label="Categoria" error={errors.categoryId} required>
                <Select value={draft.categoryId} onValueChange={(value) => set("categoryId", value)}>
                  <SelectTrigger aria-invalid={!!errors.categoryId} aria-label="Categoria">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {categories.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Nenhuma categoria criada.{" "}
                    <Link to="/admin/menu" className="font-semibold text-primary hover:underline">
                      Crie uma no cardápio
                    </Link>
                    .
                  </p>
                )}
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opções e preços</CardTitle>
              <CardDescription>Tamanhos ou versões do prato, como "Individual" e "Duplo".</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence initial={false}>
                {draft.variants.map((variant, index) => (
                  <motion.div
                    key={variant.key}
                    layout
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={variant.label}
                      onChange={(e) => updateVariant(variant.key, { label: e.target.value })}
                      placeholder="Nome da opção"
                      maxLength={40}
                      aria-label={`Nome da opção ${index + 1}`}
                      className="flex-1"
                    />
                    <div className="w-32 sm:w-40">
                      <CurrencyInput
                        value={variant.price}
                        onValueChange={(price) => updateVariant(variant.key, { price })}
                        aria-label={`Preço da opção ${index + 1}`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => set("variants", draft.variants.filter((v) => v.key !== variant.key))}
                      disabled={draft.variants.length === 1}
                      aria-label={`Remover opção ${index + 1}`}
                    >
                      <Trash2 />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {errors.variants && <p className="text-xs font-medium text-destructive">{errors.variants}</p>}

              <Button
                type="button"
                variant="soft"
                size="sm"
                onClick={() => set("variants", [...draft.variants, { key: createId(), id: "", label: "", price: "" }])}
                disabled={draft.variants.length >= 10}
              >
                <Plus /> Adicionar opção
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-10">
          <Card>
            <CardHeader>
              <CardTitle>Foto</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={draft.imageUrl}
                onChange={(url) => set("imageUrl", url)}
                className="aspect-4/3"
                maxSize={900}
              />
            </CardContent>
          </Card>

          <Card className="py-4">
            <CardContent>
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <span>
                  <span className="block text-sm font-bold">Disponível para venda</span>
                  <span className="block text-xs text-muted-foreground">Pause quando o item acabar.</span>
                </span>
                <Switch checked={draft.isAvailable} onCheckedChange={(checked) => set("isAvailable", checked)} />
              </label>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Como o cliente vê</p>
            <DishCard dish={{ ...draft, variants: previewVariants }} />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t pt-6 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" size="lg" onClick={() => navigate("/admin/menu")}>
          Cancelar
        </Button>
        <Button type="submit" size="lg" loading={saving}>
          {dish ? "Salvar alterações" : "Criar prato"}
        </Button>
      </div>
    </form>
  );
}
