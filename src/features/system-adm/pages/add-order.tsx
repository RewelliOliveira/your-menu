import { useAuth } from '@/contexts/auth-context';
import { useAddOrder } from '@/hooks/useAddOrder';
import { createDishApi } from '@/services/create-dish';
import { Header } from '../components/header';
import { Banner } from '../components/ui/banner';
import { InputLogin } from '../components/ui/input-login';
import { SelectDay } from '../components/ui/select-day';
import { TabbedSections } from '../components/ui/tabbed-sections';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Plus } from 'lucide-react';
import { useDishManagement } from '@/hooks/useDishManagement';
import { useImageHandler } from '@/hooks/useImageHandler';
import { useNavigate } from 'react-router-dom';

export function AddOrder() {
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
  } = useAddOrder(restaurantId!, token!);

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
  } = useDishManagement(token!, restaurantId!);

  const {
    imgFile,
    imgPreview,
    handleImageChange,
    setImgFile,
    setImgPreview,
  } = useImageHandler();

  async function handleSaveDish() {
    if (!itemName) {
      toast.warn('Informe o nome do prato');
      return;
    }

    if (!selectedCategoryId) {
      toast.warn('Selecione uma categoria');
      return;
    }

    if (sizeOptionsPrices.length === 0) {
      toast.warn('Adicione ao menos um tamanho com preço');
      return;
    }

    const payload = {
      name: itemName,
      description: itemDescription,
      isAvailable,
      imgUrl: '',
      sizeOptionsPrices,
      imgFile,
    };

    try {
      const response = await createDishApi(
        restaurantId!,
        Number(selectedCategoryId),
        payload,
        token!
      );
      console.log("Resposta da API após salvar prato:", response);

      navigate("/adm/edit-menu");
      toast.success('Prato salvo com sucesso!');
      setItemName('');
      setItemDescription('');
      setSizeOptionsPrices([]);
      setSelectedCategoryId('');
      setImgFile(null);
      setImgPreview(null);
    } catch (error) {
      console.error("Erro no handleSaveDish:", error);
      toast.error('Erro ao salvar prato');
    }
  }


  if (!token || !restaurantId) {
    return <p className="text-center py-8">Carregando dados do restaurante...</p>;
  }

  return (
    <section className="bg-[#f5f5f5]">
      <Header />
      <Banner />
      <TabbedSections
        title="Cadastrar item"
        onlyTitle={true}
        data={[]}
        getCategory={() => ''}
        renderItem={() => null}
      />

      <div className="flex flex-col items-center w-3/5 max-w-5xl mx-auto min-h-[60vh] p-2 gap-6">
        {/* Identificação */}
        <div className="w-full flex flex-col gap-4">
          <h2 className="text-xl font-bold text-left">Identificação</h2>
          <div className="flex flex-row items-center justify-between w-full gap-6">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center cursor-pointer mb-4"
              title="Adicionar imagem"
            >
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                {imgPreview ? (
                  <img src={imgPreview} alt="Preview da imagem" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <img
                    src="/placeholder.svg"
                    alt="Adicionar imagem"
                    className="w-12 h-12 opacity-60"
                  />
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

            <div className="flex flex-col items-start justify-center w-full max-w-full gap-4">
              <InputLogin
                label={
                  <>
                    <span>Nome do item</span> <span className="text-red-600">*</span>
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
                placeholder="Ingredientes do item"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Gerenciamento */}
        <div className="w-full flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-800">Gerenciamento do Produto</h2>

          {/* Disponibilidade */}
          <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleAvailable}
                className={`w-14 h-7 flex items-center rounded-full p-1 transition-all ${isAvailable ? "bg-green-500" : "bg-gray-300"}`}
                type="button"
                aria-label={isAvailable ? "Desativar produto" : "Ativar produto"}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-all ${isAvailable ? "translate-x-7" : ""}`}
                />
              </button>
              <span className="text-base font-medium text-gray-700">
                Produto {isAvailable ? "disponível" : "indisponível"}
              </span>
            </div>
          </div>

          {/* Categorias e Tamanhos */}
          <div className="flex flex-col gap-6 p-4 bg-white rounded-lg shadow">
            <div className="flex gap-4 ">
              {/* Seção de Categorias */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <div className="flex gap-2">
                  {categoryOptions.length === 0 ? (
                    <span className="text-gray-500 text-sm">
                      Nenhuma categoria cadastrada
                    </span>
                  ) : (
                    <SelectDay
                      options={categoryOptions}
                      value={selectedCategoryId}
                      onChange={setSelectedCategoryId}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowInput((v) => !v)}
                    title="Adicionar categoria"
                    aria-label="Adicionar categoria"
                    className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-green-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Seção de Tamanhos */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
                <SelectDay
                  options={sizeOptions}
                  value={selectedSizeId}
                  onChange={setSelectedSizeId}
                />
              </div>

              {/* Preço */}
              {/* Preço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                <input
                  type="text"
                  placeholder="0,00"
                  value={price}
                  onChange={(e) => {
                    const formatCurrencyInput = (value: string) => {
                      const numeric = value.replace(/\D/g, ""); // remove tudo que não for número
                      const cents = (Number(numeric) / 100).toFixed(2);
                      return cents.replace(".", ",");
                    };
                    setPrice(formatCurrencyInput(e.target.value));
                  }}
                  className="border border-gray-300 rounded-md px-3 py-1 w-24 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>


              {/* Botão Adicionar */}
              <button
                type="button"
                onClick={handleAddSizeOptionPrice}
                className="my-auto h-9 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed block"
                disabled={!selectedSizeId || !price}
              >
                Adicionar
              </button>
            </div>

            {/* Input para nova categoria */}
            {showInput && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1 min-w-[200px] focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Nome da nova categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  autoFocus
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={handleAddCategory}
                  disabled={!newCategory.trim()}
                >
                  Salvar
                </button>
              </div>
            )}
          </div>

          {/* Lista de Tamanhos/Preços */}
          {sizeOptionsPrices.length > 0 && (
            <div className="mt-2 p-4 bg-white rounded-lg shadow">
              <h3 className="font-medium text-gray-800 mb-3">Tamanhos e preços adicionados</h3>
              <ul className="border rounded-lg divide-y divide-gray-200">
                {sizeOptionsPrices.map((item, index) => {
                  const label = sizeOptions.find((opt) => Number(opt.value) === item.sizeOptionId)?.label ?? "";
                  return (
                    <li
                      key={`${item.sizeOptionId}-${index}`}
                      className="p-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700">
                        {label} - R$ {item.price.toFixed(2).replace('.', ',')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSizeOptionsPrices((old) => old.filter((_, i) => i !== index))}
                        className="w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        title="Remover"
                        aria-label="Remover"
                      >
                        ×
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Botão Salvar */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveDish}
              disabled={!itemName || !selectedCategoryId || sizeOptionsPrices.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Salvando...
                </span>
              ) : (
                "Salvar prato"
              )}
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}