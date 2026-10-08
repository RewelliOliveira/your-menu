import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/core/utils/utils";

export interface TabbedSectionsProps<T extends string = string, D = unknown> {
  title: string;
  onlyTitle?: boolean;
  data: D[];
  renderItem: (item: D) => React.ReactNode;
  getCategory: (item: D) => T;
  renderAfterItems?: () => React.ReactNode;
  categoriesOrder?: T[];
  onDeleteCategory?: (category: T) => void;
}

export function TabbedSections<T extends string = string, D = unknown>({
  title,
  data,
  renderItem,
  getCategory,
  renderAfterItems,
  onlyTitle = false,
  categoriesOrder,
  onDeleteCategory,
}: TabbedSectionsProps<T, D>) {
  const categories = useMemo(() => {
    if (categoriesOrder?.length) {
      return categoriesOrder;
    }

    const unique = new Set<T>();
    data.forEach((item) => unique.add(getCategory(item)));
    return Array.from(unique);
  }, [data, getCategory, categoriesOrder]);

  const [selectedTab, setSelectedTab] = useState<T>(categories[0] ?? ("" as T));
  const [isSticky, setIsSticky] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tabsRef = useRef<HTMLDivElement>(null);

  function handleTabClick(tab: T) {
    setSelectedTab(tab);
    const el = sectionRefs.current[tab];
    const tabsHeight = tabsRef.current?.offsetHeight || 60;
    if (el) {
      window.scrollTo({
        top: el.offsetTop - tabsHeight,
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {
    function handleScroll() {
      if (!tabsRef.current) return;
      const top = tabsRef.current.getBoundingClientRect().top;
      setIsSticky(top <= 0);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (onlyTitle) {
    return (
      <div className="w-full bg-[#f5f5f5] py-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-3">
            {title}
          </h1>
          <div className="w-24 h-1 bg-orange-500 rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f5f5f5] py-6">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
          {title}
        </h1>

        {categories.length > 0 && (
          <div
            ref={tabsRef}
            className={cn(
              "sticky top-0 bg-[#f5f5f5] z-30 mb-8 border-b border-gray-200",
              isSticky && "shadow-xs bg-white/95 backdrop-blur-md"
            )}
          >
            <div className="flex overflow-x-auto scrollbar-none gap-2 py-2">
              {categories.map((tab) => {
                const isSelected = selectedTab === tab;
                return (
                  <div key={tab} className="relative flex-shrink-0">
                    <button
                      onClick={() => handleTabClick(tab)}
                      className={cn(
                        "px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer",
                        isSelected
                          ? "bg-orange-600 text-white shadow-xs"
                          : "text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {tab}
                    </button>
                    {onDeleteCategory && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCategory(tab);
                        }}
                        className="ml-1 p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors cursor-pointer"
                        title="Excluir categoria"
                        aria-label={`Excluir categoria ${tab}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {categories.map((tab) => {
          const filteredItems = data.filter((item) => getCategory(item) === tab);
          return (
            <div
              key={tab}
              ref={(el) => {
                sectionRefs.current[tab] = el;
              }}
              className="mb-12 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-5 border-b border-gray-200 pb-2">
                <h2 className="text-xl font-bold text-gray-800">{tab}</h2>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {filteredItems.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item, index) => (
                  <div key={index}>{renderItem(item)}</div>
                ))}
                {renderAfterItems && <div>{renderAfterItems()}</div>}
              </div>

              {filteredItems.length === 0 && !renderAfterItems && (
                <p className="text-gray-500 text-sm py-4">Nenhum item nesta seção.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
