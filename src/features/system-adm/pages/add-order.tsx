import { useState } from "react";
import { Header } from "../components/header";
import { Banner } from "../components/ui/banner";
import { InputLogin } from "../components/ui/input-login";
import { SelectDay } from "../components/ui/select-day";
import { TabbedSections } from "../components/ui/tabbed-sections";

export function AddOrder() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [showInput, setShowInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleToggleAvailable = () => {
    setIsAvailable((prev) => !prev);
  };

  const handleAddCategory = () => {
    if (
      newCategory.trim() &&
      !categories.some(
        (c) => c.label.toLowerCase() === newCategory.trim().toLowerCase()
      )
    ) {
      setCategories([
        ...categories,
        {
          label: newCategory.trim(),
          value: newCategory.trim().toLowerCase().replace(/\s+/g, "-"),
        },
      ]);
      setNewCategory("");
      setShowInput(false);
    }
  };

  return (
    <section className="bg-[#f5f5f5]">
      <Header />
      <Banner />
      <TabbedSections
        title="Cadastrar item"
        onlyTitle={true}
        data={[]}
        getCategory={() => ""}
        renderItem={() => null}
      />
      <div className="flex flex-col items-center w-3/5 max-w-5xl mx-auto min-h-[60vh] p-2 sm:p-4 gap-6 sm:gap-8">
        {/* Identificação */}
        <div className="w-full flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-left">
            Identificação
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6 sm:gap-8">
            <label className="flex flex-col items-center cursor-pointer mb-4 md:mb-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                <img
                  src="/placeholder.svg"
                  alt="Adicionar imagem"
                  className="w-12 h-12 sm:w-16 sm:h-16 opacity-60"
                />
              </div>
              <input type="file" accept="image/*" className="hidden" />
            </label>
            <div className="flex flex-col items-center md:items-start justify-center w-full md:w-3/5 max-w-full gap-4">
              <InputLogin
                label={
                  <>
                    Nome do item <span className="text-red-600">*</span>
                  </>
                }
                type="text"
                placeholder="Digite o nome do item"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <InputLogin
                label={
                  <>
                    Descrição <span className="text-gray-500">(opcional)</span>
                  </>
                }
                type="text"
                placeholder="ingredientes do item"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Gerenciamento */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">Gerenciamento</h2>
          </div>
          {/* Linha: Disponibilidade */}
          <div className="flex flex-row items-center gap-2 w-full">
            <button
              onClick={handleToggleAvailable}
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${
                isAvailable ? "bg-green-500" : "bg-gray-400"
              }`}
              type="button"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  isAvailable ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
            <span className="text-sm font-medium min-w-[130px]">
              Produto {isAvailable ? "disponível" : "indisponível"}
            </span>
          </div>
          {/* Linha: Selecionar categoria + adicionar */}
          <div className="flex flex-row flex-wrap items-center gap-3 w-full">
            <div>
              {categories.length === 0 ? (
                <span className="text-gray-500 text-sm">
                  Nenhuma categoria cadastrada. Adicione uma categoria.
                </span>
              ) : (
                <SelectDay options={categories} />
              )}
            </div>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100 text-2xl text-green-600 font-bold"
              onClick={() => setShowInput((v) => !v)}
              title="Adicionar categoria"
            >
              +
            </button>
            {/* Linha: Input para nova categoria */}
            {showInput && (
              <div
                className="flex flex-row items-center gap-2 mt-2 w-2/5
                sm:mt-0
                sm:w-auto
                xs:w-full
                xs:flex-col
                xs:items-stretch
                xs:gap-2
              "
              >
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 flex-1 min-w-[120px]"
                  placeholder="Nova categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddCategory();
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  className="px-2 py-1 bg-green-500 text-white rounded"
                  onClick={handleAddCategory}
                >
                  Salvar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
