import { useState, useRef, useEffect } from "react";

// Define os tipos de propriedades aceitas pelo componente
type TabbedSectionsProps<T, D> = {
  title: string; // Título exibido acima das abas
  categories: readonly T[]; // Lista de categorias/abas
  data: D[]; // Lista completa dos dados a serem exibidos
  renderItem: (item: D) => React.ReactNode; // Função que renderiza um item da lista
  filterByCategory?: (item: D, category: T) => boolean; // Função de filtro personalizada (opcional)
};

// Componente principal
export function TabbedSections<T extends string, D>({
  title,
  categories,
  data,
  renderItem,
  filterByCategory,
}: TabbedSectionsProps<T, D>) {
  // Estado da aba atualmente selecionada
  const [selectedTab, setSelectedTab] = useState<T>(categories[0]);

  // Estado para ativar classe sticky quando a barra de abas colar no topo
  const [isSticky, setIsSticky] = useState(false);

  // Referências para cada seção de categoria (usado para scroll automático)
  const sectionRefs = useRef<Record<T, HTMLDivElement | null>>(
    categories.reduce((acc, cat) => {
      acc[cat] = null;
      return acc;
    }, {} as Record<T, HTMLDivElement | null>)
  );

  // Referência à barra de abas (tabs)
  const tabsRef = useRef<HTMLDivElement>(null);

  // Função chamada ao clicar em uma aba
  function handleTabClick(tab: T) {
    setSelectedTab(tab); // Atualiza a aba ativa

    const el = sectionRefs.current[tab]; // Elemento da seção da aba clicada
    const tabsHeight = tabsRef.current?.offsetHeight || 0; // Altura da barra de abas

    // Faz scroll suave até a seção correspondente
    if (el) {
      window.scrollTo({
        top: el.offsetTop - tabsHeight,
        behavior: "smooth",
      });
    }
  }

  // Efeito para monitorar o scroll e aplicar comportamento sticky na barra de abas
  useEffect(() => {
    function handleScroll() {
      if (!tabsRef.current) return;
      const top = tabsRef.current.getBoundingClientRect().top;
      setIsSticky(top <= 0); // Se a barra encostou no topo, ativa sticky
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Executa imediatamente ao montar
    return () => window.removeEventListener("scroll", handleScroll); // Limpeza do listener
  }, []);

  // Filtro padrão (caso o usuário não tenha fornecido um personalizado)
  const defaultFilter = (item: D, category: T) =>
    (item as any).status === category;

  return (
    <div className="w-full bg-[#EDE4CF] py-6">
      <div className="max-w-[75%] mx-auto px-4">
        {/* Título principal */}
        <h1 className="text-xl font-semibold text-center text-gray-800 mb-4">{title}</h1>

        {/* Barra de Abas (Tabs) */}
        <div ref={tabsRef} className="sticky top-0 bg-[#EDE4CF] z-10 mb-6">
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
                          ? "border-b-4 border-orange-500" // Aba ativa com borda inferior (modo sticky)
                          : "border-b-2 border-black" // Aba inativa com borda inferior (modo sticky)
                        : isSelected
                        ? "border-t-4 border-orange-500" // Aba ativa com borda superior (modo normal)
                        : "border-t-2 border-black" // Aba inativa com borda superior (modo normal)
                    }
                  `}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Renderização de cada seção de categoria */}
        {categories.map((tab) => {
          // Aplica filtro por categoria (personalizado ou padrão)
          const filteredItems = data.filter((item) =>
            filterByCategory ? filterByCategory(item, tab) : defaultFilter(item, tab)
          );

          return (
            <div
              key={tab}
              ref={(el) => {
                sectionRefs.current[tab] = el; // Salva referência da seção
              }}
              className="mb-12"
            >
              {/* Título da seção */}
              <h2 className="text-lg font-semibold mb-4">{tab}</h2>

              {/* Renderiza os itens filtrados ou mensagem vazia */}
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredItems.map((item) => (
                    <div key={(item as any).id}>
                      {renderItem(item)}
                    </div>
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
