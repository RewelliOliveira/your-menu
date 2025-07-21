import { useAuth } from '@/contexts/auth-context';
import { Header } from '../components/header';
import { Banner } from '../components/ui/banner';
import { InputLogin } from '../components/ui/input-login';
import { SelectDay } from '../components/ui/select-day';
import { TabbedSections } from '../components/ui/tabbed-sections';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDishManagement } from '@/hooks/useDishManagement';
import { useImageHandler } from '@/hooks/useImageHandler';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { updateDishApi, getDishDetails } from '@/services/update-dish';

export function EditOrder() {
    const { token, restaurantId } = useAuth();
    const { dishId } = useParams<{ dishId: string }>();
    const navigate = useNavigate();

    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    const [isLoadingDish, setIsLoadingDish] = useState(true);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    const handleToggleAvailable = () => setIsAvailable(prev => !prev);

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
        sizeOptionsPrices = [],
        setSizeOptionsPrices,
        handleAddSizeOptionPrice,
    } = useDishManagement(token!, restaurantId!);

    const {
        imgFile,
        imgPreview,
        handleImageChange,
        setImgPreview,
    } = useImageHandler();

    useEffect(() => {
        const loadDishData = async () => {
            if (!dishId || !restaurantId || !token) {
                toast.error('ID do prato inválido');
                navigate("/adm/edit-menu");
                return;
            }

            try {
                setIsLoadingDish(true);
                const dishData = await getDishDetails(restaurantId, Number(dishId), token);

                // Preenche os estados com os dados do prato
                setItemName(dishData.name);
                setItemDescription(dishData.description || '');
                setIsAvailable(dishData.isAvailable);
                setSelectedCategoryId(String(dishData.categoryId));
                setSizeOptionsPrices(dishData.sizeOptionsPrices || []);

                if (dishData.imgUrl) {
                    setImgPreview(dishData.imgUrl);
                }
            } catch (error) {
                console.error("Erro ao carregar prato:", error);
                toast.error('Erro ao carregar dados do prato');
                navigate("/adm/edit-menu");
            } finally {
                setIsLoadingDish(false);
                setInitialLoadComplete(true);
            }
        };

        loadDishData();
    }, [dishId, restaurantId, token, navigate]);

    async function handleUpdateDish() {
        if (!dishId || isNaN(Number(dishId))) {
            toast.error('ID do prato inválido');
            return;
        }

        if (!itemName.trim()) {
            toast.warn('Informe o nome do prato');
            return;
        }

        if (!selectedCategoryId) {
            toast.warn('Selecione uma categoria');
            return;
        }

        if (!sizeOptionsPrices || sizeOptionsPrices.length === 0) {
            toast.warn('Adicione ao menos um tamanho com preço');
            return;
        }

        const payload = {
            name: itemName.trim(),
            description: itemDescription.trim(),
            isAvailable,
            imgUrl: imgPreview?.startsWith('http') ? imgPreview : '',
            sizeOptionsPrices,
            imgFile,
        };

        try {
            await updateDishApi(
                restaurantId!,
                Number(selectedCategoryId),
                Number(dishId),
                payload,
                token!
            );

            toast.success('Prato atualizado com sucesso!');
            navigate("/adm/edit-menu");
        } catch (error) {
            console.error("Erro ao atualizar prato:", error);
            toast.error('Erro ao atualizar prato');
        }
    }

    if (!token || !restaurantId) {
        return <p className="text-center py-8">Carregando dados do restaurante...</p>;
    }

    if (isLoadingDish || !initialLoadComplete) {
        return <p className="text-center py-8">Carregando dados do prato...</p>;
    }

    return (
        <section className="bg-[#f5f5f5]">
            <Header />
            <Banner />
            <TabbedSections
                title="Editar item"
                onlyTitle={true}
                data={[]}
                getCategory={() => ''}
                renderItem={() => null}
            />

            <div className="flex flex-col items-center w-3/5 max-w-5xl mx-auto min-h-[60vh] p-2 gap-6">
                <div className="w-full flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-left">Identificação</h2>
                    <div className="flex flex-row items-center justify-between w-full gap-6">
                        <label htmlFor="image-upload" className="flex flex-col items-center cursor-pointer mb-4" title="Adicionar imagem">
                            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                {imgPreview ? (
                                    <img src={imgPreview} alt="Preview da imagem" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <img src="/placeholder.svg" alt="Adicionar imagem" className="w-12 h-12 opacity-60" />
                                )}
                            </div>
                            <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>

                        <div className="flex flex-col items-start justify-center w-full max-w-full gap-4">
                            <InputLogin
                                label={<><span>Nome do item</span> <span className="text-red-600">*</span></>}
                                type="text"
                                placeholder="Digite o nome do item"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                            />
                            <InputLogin
                                label={<><span>Descrição</span> <span className="text-gray-500">(opcional)</span></>}
                                type="text"
                                placeholder="Ingredientes do item"
                                value={itemDescription}
                                onChange={(e) => setItemDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-gray-800">Gerenciamento do Produto</h2>

                    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleToggleAvailable}
                                className={`w-14 h-7 flex items-center rounded-full p-1 transition-all ${isAvailable ? "bg-green-500" : "bg-gray-300"}`}
                                type="button"
                                aria-label={isAvailable ? "Desativar produto" : "Ativar produto"}
                            >
                                <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-all ${isAvailable ? "translate-x-7" : ""}`} />
                            </button>
                            <span className="text-base font-medium text-gray-700">
                                Produto {isAvailable ? "disponível" : "indisponível"}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 p-4 bg-white rounded-lg shadow">
                        <div className="flex gap-4 ">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                <SelectDay
                                    options={categoryOptions}
                                    value={selectedCategoryId}
                                    onChange={setSelectedCategoryId}
                                />
                            </div>

                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
                                <SelectDay
                                    options={sizeOptions}
                                    value={selectedSizeId}
                                    onChange={setSelectedSizeId}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-1 w-24 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleAddSizeOptionPrice}
                                className="my-auto h-9 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed block"
                                disabled={!selectedSizeId || !price}
                            >
                                Adicionar
                            </button>
                        </div>
                    </div>

                    {sizeOptionsPrices?.length > 0 && (
                        <div className="mt-2 p-4 bg-white rounded-lg shadow">
                            <h3 className="font-medium text-gray-800 mb-3">Tamanhos e preços adicionados</h3>
                            <ul className="border rounded-lg divide-y divide-gray-200">
                                {sizeOptionsPrices.map((item, index) => {
                                    const label = sizeOptions?.find((opt) => Number(opt.value) === item.sizeOptionId)?.label ?? "";
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
                                                onClick={() => setSizeOptionsPrices((old) => old?.filter((_, i) => i !== index) || [])}
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

                    <div className="flex justify-end">
                        <button
                            onClick={handleUpdateDish}
                            disabled={!itemName || !selectedCategoryId || sizeOptionsPrices.length === 0}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Salvando..." : "Atualizar prato"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
