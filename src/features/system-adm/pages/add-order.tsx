import { useState } from "react";
import { Header } from "../components/header";
import { Banner } from "../components/ui/banner";
import { InputLogin } from "../components/ui/input-login";
import { TabbedSections } from "../components/ui/tabbed-sections";

export function AddOrder() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const handleToggleAvailable = () => {
    setIsAvailable((prev) => !prev);
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
        {/* Linha com imagem e inputs */}
        <h2 className="text-xl sm:text-2xl font-bold w-full text-left">
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
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">Gerenciamento</h2>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
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
        </div>
      </div>
    </section>
  );
}
