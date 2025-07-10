import { useEffect, useMemo, useRef, useState } from "react";

type TabbedSectionsProps<T extends string, D> = {
  title: string;
  data: D[];
  renderItem: (item: D) => React.ReactNode;
  getCategory: (item: D) => T;
  renderAfterItems?: () => React.ReactNode;
  categoriesOrder?: T[]; // 🆕 ordem fixa opcional
};

export function TabbedSections<T extends string, D>({
  title,
  data,
  renderItem,
  getCategory,
  renderAfterItems,
  categoriesOrder,
}: TabbedSectionsProps<T, D>) {
  const categories = useMemo(() => {
    const unique = new Set<T>();
    data.forEach((item) => unique.add(getCategory(item)));

    const dynamic = Array.from(unique);

    // se `categoriesOrder` for passada, respeita a ordem dela
    if (categoriesOrder?.length) {
      return categoriesOrder.filter((cat) => dynamic.includes(cat));
    }

    return dynamic;
  }, [data, getCategory, categoriesOrder]);

  const [selectedTab, setSelectedTab] = useState<T>(categories[0] ?? ("" as T));
  const [isSticky, setIsSticky] = useState(false);

  const sectionRefs = useRef<Record<T, HTMLDivElement | null>>(
    categories.reduce((acc, cat) => {
      acc[cat] = null;
      return acc;
    }, {} as Record<T, HTMLDivElement | null>)
  );

  const tabsRef = useRef<HTMLDivElement>(null);

  function handleTabClick(tab: T) {
    setSelectedTab(tab);
    const el = sectionRefs.current[tab];
    const tabsHeight = tabsRef.current?.offsetHeight || 0;
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

  return (
    <div className="w-full bg-[#f5f5f5] py-6">
      <div className="max-w-[75%] mx-auto px-4">
        <h1 className="text-xl font-semibold text-center text-gray-800 mb-4">
          {title}
        </h1>

        <div ref={tabsRef} className="sticky top-0 bg-[#f5f5f5] z-10 mb-6">
          <div className="flex justify-between">
            {categories.map((tab) => {
              const isSelected = selectedTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`flex-1 text-center py-2 font-medium transition-colors duration-200 text-black
                    ${
                      isSticky
                        ? isSelected
                          ? "border-b-4 border-orange-500"
                          : "border-b-2 border-black"
                        : isSelected
                        ? "border-t-4 border-orange-500"
                        : "border-t-2 border-black"
                    }
                  `}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {categories.map((tab) => {
          const filteredItems = data.filter(
            (item) => getCategory(item) === tab
          );

          return (
            <div
              key={tab}
              ref={(el) => {
                sectionRefs.current[tab] = el;
              }}
              className="mb-12"
            >
              <h2 className="text-lg font-semibold mb-4">{tab}</h2>
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredItems.map((item, index) => (
                    <div key={index}>{renderItem(item)}</div>
                  ))}
                  {renderAfterItems && <div>{renderAfterItems()}</div>}
                </div>
              ) : (
                <div className="grid grid-cols-1">
                  {renderAfterItems && <div>{renderAfterItems()}</div>}
                  <p className="text-black-600">Nenhum item nesta seção.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
