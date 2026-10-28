import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { motion } from "motion/react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { MenuSection } from "@/types/menu";

import { sectionDomId } from "./section-id";

interface CategoryNavProps {
  sections: MenuSection[];
  query: string;
  onQueryChange: (query: string) => void;
}

export function CategoryNav({ sections, query, onQueryChange }: CategoryNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const listRef = useRef<HTMLDivElement>(null);
  const sectionKey = sections.map((s) => s.id).join();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id.replace("secao-", ""));
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    sectionKey.split(",").forEach((id) => {
      const element = id && document.getElementById(sectionDomId(id));
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [sectionKey]);

  useEffect(() => {
    const list = listRef.current;
    const chip = list?.querySelector<HTMLElement>(`[data-id="${activeId}"]`);
    if (list && chip) list.scrollTo({ left: chip.offsetLeft - list.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [activeId]);

  function scrollToSection(id: string) {
    document.getElementById(sectionDomId(id))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center">
        <div className="relative md:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar no cardápio"
            className="h-10 rounded-full bg-card pr-9 pl-10 [&::-webkit-search-cancel-button]:hidden"
            aria-label="Buscar no cardápio"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              aria-label="Limpar busca"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div ref={listRef} className="-mx-4 flex gap-1.5 overflow-x-auto px-4 scrollbar-none md:mx-0 md:px-0">
          {sections.map((section) => {
            const active = section.id === activeId;
            return (
              <button
                key={section.id}
                type="button"
                data-id={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "relative shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="category-active"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative">{section.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
