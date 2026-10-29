import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FolderPlus, MoreHorizontal, Pencil, Plus, Search, Trash2, UtensilsCrossed } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { pluralize } from "@/lib/format";
import { notifyError } from "@/lib/notify";
import { deleteCategory, deleteDish, getMenu, setDishAvailability } from "@/services/menu-service";
import type { Category, Dish, MenuSection } from "@/types/menu";
import { PageHeader } from "../PageHeader";
import { CategoryDialog } from "./CategoryDialog";
import { DishRow } from "./DishRow";

type PendingDelete = { type: "dish"; item: Dish } | { type: "category"; item: MenuSection };

export function MenuPage() {
  const { data: sections, loading, error, reload, setData } = useAsync(getMenu);
  const [query, setQuery] = useState("");
  const [categoryDialog, setCategoryDialog] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  });
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!sections || !term) return sections ?? [];
    return sections
      .map((section) => ({ ...section, dishes: section.dishes.filter((dish) => dish.name.toLowerCase().includes(term)) }))
      .filter((section) => section.dishes.length > 0);
  }, [sections, query]);

  function updateDish(dishId: string, patch: Partial<Dish>) {
    setData((list) =>
      list?.map((section) => ({
        ...section,
        dishes: section.dishes.map((dish) => (dish.id === dishId ? { ...dish, ...patch } : dish)),
      })),
    );
  }

  async function toggleAvailability(dish: Dish, isAvailable: boolean) {
    updateDish(dish.id, { isAvailable });
    try {
      await setDishAvailability(dish.id, isAvailable);
      toast.success(isAvailable ? `"${dish.name}" voltou ao cardápio` : `"${dish.name}" foi pausado`);
    } catch (err) {
      updateDish(dish.id, { isAvailable: !isAvailable });
      notifyError(err);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    if (pendingDelete.type === "dish") {
      await deleteDish(pendingDelete.item.id);
      setData((list) =>
        list?.map((section) => ({ ...section, dishes: section.dishes.filter((d) => d.id !== pendingDelete.item.id) })),
      );
    } else {
      await deleteCategory(pendingDelete.item.id);
      setData((list) => list?.filter((section) => section.id !== pendingDelete.item.id));
    }
    toast.success("Excluído com sucesso");
  }

  function handleCategorySaved(category: Category) {
    setData((list) => {
      if (!list) return list;
      const exists = list.some((section) => section.id === category.id);
      return exists
        ? list.map((section) => (section.id === category.id ? { ...section, name: category.name } : section))
        : [...list, { ...category, dishes: [] }];
    });
    setCategoryDialog({ open: false, category: null });
    toast.success("Categoria salva");
  }


  return (
    <div className="space-y-6">
      <PageHeader
        title="Cardápio"
        actions={
          <>
            <Button variant="outline" onClick={() => setCategoryDialog({ open: true, category: null })}>
              <FolderPlus /> Categoria
            </Button>
            <Button asChild>
              <Link to="/admin/menu/new">
                <Plus /> Novo prato
              </Link>
            </Button>
          </>
        }
      />

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar prato…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
          aria-label="Buscar prato"
        />
      </div>

      {error && !sections ? (
        <ErrorState error={error} onRetry={() => reload()} />
      ) : loading && !sections ? (
        <div className="space-y-4">
          <Skeleton className="h-56" />
          <Skeleton className="h-40" />
        </div>
      ) : sections?.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="Seu cardápio está vazio"
          description="Comece criando uma categoria, depois adicione os pratos."
          action={
            <Button onClick={() => setCategoryDialog({ open: true, category: null })}>
              <FolderPlus /> Criar primeira categoria
            </Button>
          }
          className="rounded-2xl border bg-card"
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="Nenhum prato encontrado" description={`Nada corresponde a "${query}".`} />
      ) : (
        <div className="space-y-5">
          {filtered.map((section) => (
            <section key={section.id} className="overflow-hidden rounded-2xl border bg-card shadow-xs">
              <header className="flex items-center justify-between gap-3 border-b px-4 py-2.5">
                <h2 className="flex min-w-0 items-baseline gap-2 font-bold">
                  <span className="truncate">{section.name}</span>
                  <span className="text-xs font-medium text-muted-foreground tabular-nums">{section.dishes.length}</span>
                </h2>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/admin/menu/new?category=${section.id}`}>
                      <Plus /> <span className="hidden sm:inline">Adicionar</span>
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label={`Ações da categoria ${section.name}`}>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setCategoryDialog({ open: true, category: section })}>
                        <Pencil /> Renomear
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onSelect={() => setPendingDelete({ type: "category", item: section })}>
                        <Trash2 /> Excluir categoria
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </header>

              {section.dishes.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhum prato nesta categoria ainda.</p>
              ) : (
                <ul className="divide-y">
                  <AnimatePresence initial={false}>
                    {section.dishes.map((dish) => (
                      <DishRow
                        key={dish.id}
                        dish={dish}
                        onToggleAvailability={toggleAvailability}
                        onDelete={(item) => setPendingDelete({ type: "dish", item })}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </section>
          ))}
        </div>
      )}

      <CategoryDialog
        open={categoryDialog.open}
        category={categoryDialog.category}
        onOpenChange={(open) => setCategoryDialog((prev) => ({ ...prev, open }))}
        onSaved={handleCategorySaved}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={pendingDelete?.type === "category" ? "Excluir categoria?" : "Excluir prato?"}
        description={
          pendingDelete?.type === "category"
            ? `"${pendingDelete.item.name}" e ${pluralize(pendingDelete.item.dishes.length, "prato")} serão removidos permanentemente.`
            : `"${pendingDelete?.item.name}" será removido permanentemente do cardápio.`
        }
        confirmLabel="Excluir"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
