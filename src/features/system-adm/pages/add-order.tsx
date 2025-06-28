import { useState } from "react";
import { Header } from "../components/header";
import { Banner } from "../components/ui/banner";
import { InputLogin } from "../components/ui/input-login";
import { TabbedSections } from "../components/ui/tabbed-sections";

export function AddOrder() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");

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
      <div className="flex flex-col items-center w-3/4 mx-auto h-[3/4] p-4 gap-8">
        {/* Linha com imagem e inputs */}
        <div className="flex flex-row items-center justify-around w-full gap-8">
          <label className="flex flex-col items-center cursor-pointer">
            <div className="w-45 h-45 bg-gray-200 rounded-lg flex items-center justify-center">
              <img
                src="/placeholder.svg"
                alt="Adicionar imagem"
                className="w-16 h-16 opacity-60"
              />
            </div>
            <input type="file" accept="image/*" className="hidden" />
          </label>
          <div className="flex flex-col items-center justify-center w-3/5 max-w-3/4 gap-4">
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
        {/* Outras sessões do formulário alinhadas verticalmente */}
        <div className="w-full flex flex-col items-center">
          <h2>Gerenciamento</h2>
        </div>
      </div>
    </section>
  );
}
