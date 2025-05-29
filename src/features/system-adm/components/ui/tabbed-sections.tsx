import { useState, useRef, useEffect } from "react";

type TabbedSectionsProps<T, D> = {
  title: string;
  categories: readonly T[];
  data: D[];
  renderItem: (item: D) => React.ReactNode;
  filterByCategory?: (item: D, category: T) => boolean;
};

export function TabbedSections<T extends string, D>({
  title,
  categories,
  data,
  renderItem,
  filterByCategory,
}: TabbedSectionsProps<T, D>) {
  const [selectedTab, setSelectedTab] = useState<T>(categories[0]);
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

  const defaultFilter = (item: D, category: T) =>
    (item as any).status === category;

  return (
    <div className="w-full bg-[#f3e6d8] py-6">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-xl font-semibold text-center text-gray-800 mb-4">{title}</h1>

        {/* Tabs */}
        <div ref={tabsRef} className="sticky top-0 bg-[#f3e6d8] z-10 mb-6">
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
          const filteredItems = data.filter((item) =>
            filterByCategory ? filterByCategory(item, tab) : defaultFilter(item, tab)
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
                  {filteredItems.map((item) => (
                    <div key={(item as any).id}>{renderItem(item)}</div>
                  ))}
                </div>
              ) : (
                <p className="text-black-600">Nenhum item nesta seção.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
