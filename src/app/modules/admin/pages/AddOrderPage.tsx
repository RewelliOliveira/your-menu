import { useAuth } from "@/app/hooks/use-auth";
import { useAddOrder } from "@/app/hooks/use-add-order";
import { createDishApi } from "@/infrastructure/services/dish-service";
import { Header } from "@/app/components/layout/Header";
import { Banner } from "@/app/components/layout/Banner";
import { Input } from "@/app/components/ui/Input";
import { SimpleSelect } from "@/app/components/ui/Select";
import { Button } from "@/app/components/ui/Button";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { useDishManagement } from "@/app/hooks/use-dish-management";
import { useImageHandler } from "@/app/hooks/use-image-handler";
import { useNavigate } from "react-router-dom";
import { parseCurrencyInput } from "@/core/utils/utils";

export function AddOrderPage() {
  const { token, restaurantId } = useAuth();
  const navigate = useNavigate();

  const {
    itemName,
    setItemName,
    itemDescription,
    setItemDescription,
    isAvailable,
    handleToggleAvailable,
    newCategory,
    setNewCategory,
    showInput,
    setShowInput,
    handleAddCategory,
  } = useAddOrder(restaurantId || "", token || "");

  const {
    isLoading,
    sizeOptions,
    categoryOptions,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSizeId,
    setSelectedSizeId,
    price,
    setPrice,
    sizeOptionsPrices,
    setSizeOptionsPrices,
    handleAddSizeOptionPrice,
  } = useDishManagement(token || "", restaurantId || "");

  const {
    imgFile,
    imgPreview,
    handleImageChange,
    setImgFile,
    setImgPreview,
  } = useImageHandler();

  async function handleSaveDish() {
    if (!itemName.trim()) {
      toast.warn("Informe o nome do prato");
      return;
    }

    if (!selectedCategoryId) {
      toast.warn("Selecione uma categoria");
      return;
    }

    if (sizeOptionsPrices.length === 0) {
      toast.warn("Adicione ao menos um tamanho com preço");
      return;
    }

    const payload = {
      name: itemName.trim(),
      description: itemDescription.trim(),
      isAvailable,
      imgUrl: "",
      sizeOptionsPrices,
      imgFile,
    };

    try {
      await createDishApi(
        restaurantId || "rest-mock-123",
        Number(selectedCategoryId),
        payload,
        token || ""
      );

      toast.success("Prato cadastrado com sucesso!");
      navigate("/adm/edit-menu");
      setItemName("");
      setItemDescription("");
      setSizeOptionsPrices([]);
      setSelectedCategoryId("");
      setImgFile(null);
      setImgPreview(null);
    } catch {
      toast.error("Erro ao salvar prato. Tente novamente.");
    }
  }

  if (!token || !restaurantId) {
    return <p className="text-center py-8">Carregando dados do restaurante...</p>;
  }

  return (
    <section className="bg-[#f5f5f5] min-h-screen pb-16">
      <Header isAdmin={true} />
      <Banner isAdmin={true} />

      <div className="w-full bg-white py-6 border-b border-gray-200 mb-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Cadastrar Novo Prato
          </h1>
          <div className="w-20 h-1 bg-orange-500 rounded-full mx-auto mt-2" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">
            1. Identificação do Prato
          </h2>

          <div className="flex flex-col md:flex-row items-start gap-6">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center cursor-pointer group"
              title="Adicionar foto do prato"
            >
              <div className="w-36 h-36 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden group-hover:border-orange-500 transition-colors">
                {imgPreview ? (
                  <img
                    src={imgPreview}
                    alt="Preview da imagem"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <img
                      src="/placeholder.svg"
                      alt="Placeholder"
                      className="w-10 h-10 opacity-50"
                    />
                    <span className="text-xs">Foto do prato</span>
                  </div>
                )}
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            <div className="flex-1 w-full space-y-4">
              <Input
                label={
                  <>
                    <span>Nome do item</span> <span className="text-red-500">*</span>
                  </>
                }
                placeholder="Ex: Smash Burger Especial"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />

              <Input
                label="Descrição / Ingredientes (opcional)"
                placeholder="Ex: Pão brioche, 160g de blend artesanal, cheddar derretido..."
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">
            2. Disponibilidade e Categorização
          </h2>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <button
              onClick={handleToggleAvailable}
              className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                isAvailable ? "bg-green-500" : "bg-gray-400"
              }`}
              type="button"
              aria-label={isAvailable ? "Desativar produto" : "Ativar produto"}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                  isAvailable ? "translate-x-6" : ""
                }`}
              />
            </button>
            <span className="text-sm font-semibold text-gray-700">
              Item {isAvailable ? "Disponível no cardápio" : "Indisponível temporariamente"}
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-800">Categoria *</span>
                  <button
                    type="button"
                    onClick={() => setShowInput((v) => !v)}
                    className="text-xs text-orange-600 hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Nova
                  </button>
                </div>
                <SimpleSelect
                  options={categoryOptions}
                  value={selectedCategoryId}
                  onChange={setSelectedCategoryId}
                  placeholder="Selecione a categoria"
                />
              </div>

              <div>
                <span className="text-sm font-semibold text-gray-800 block mb-1">
                  Tamanho *
                </span>
                <SimpleSelect
                  options={sizeOptions}
                  value={selectedSizeId}
                  onChange={setSelectedSizeId}
                  placeholder="Selecione o tamanho"
                />
              </div>

              <div>
                <Input
                  label="Preço (R$) *"
                  placeholder="0,00"
                  value={price}
                  onChange={(e) => setPrice(parseCurrencyInput(e.target.value))}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddSizeOptionPrice}
                disabled={!selectedSizeId || !price}
              >
                + Adicionar Tamanho & Preço
              </Button>
            </div>

            {showInput && (
              <div className="flex items-center gap-2 p-3 bg-orange-50/60 rounded-xl border border-orange-200">
                <input
                  type="text"
                  className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Nome da nova categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  autoFocus
                />
                <Button size="sm" type="button" onClick={handleAddCategory}>
                  Salvar
                </Button>
              </div>
            )}
          </div>

          {sizeOptionsPrices.length > 0 && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b text-xs font-bold text-gray-600 uppercase">
                Tamanhos Adicionados
              </div>
              <ul className="divide-y divide-gray-100">
                {sizeOptionsPrices.map((item, index) => {
                  const label =
                    sizeOptions.find((opt) => Number(opt.value) === item.sizeOptionId)
                      ?.label ?? `Tamanho #${item.sizeOptionId}`;

                  return (
                    <li
                      key={`${item.sizeOptionId}-${index}`}
                      className="px-4 py-3 flex justify-between items-center"
                    >
                      <span className="text-sm font-medium text-gray-800">
                        {label} —{" "}
                        <strong className="text-orange-600">
                          R$ {item.price.toFixed(2).replace(".", ",")}
                        </strong>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setSizeOptionsPrices((old) =>
                            old.filter((_, i) => i !== index)
                          )
                        }
                        className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        Remover
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={() => navigate("/adm/edit-menu")}
            type="button"
          >
            Voltar ao Cardápio
          </Button>
          <Button
            onClick={handleSaveDish}
            disabled={!itemName.trim() || !selectedCategoryId || sizeOptionsPrices.length === 0 || isLoading}
            type="button"
          >
            {isLoading ? "Salvando..." : "Salvar Prato"}
          </Button>
        </div>
      </div>
    </section>
  );
}
