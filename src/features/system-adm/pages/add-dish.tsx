// import { createItem } from "@/services/create-dish";
// import { useState } from "react";
// import { Header } from "../components/header";
// import { Banner } from "../components/ui/banner";
// import { ConfirmModal } from "../components/ui/confirm-modal";
// import { InputLogin } from "../components/ui/input-login";
// import { SelectDay } from "../components/ui/select-day";
// import { TabbedSections } from "../components/ui/tabbed-sections";

// export function AddDish() {
//   const [itemName, setItemName] = useState("");
//   const [itemDescription, setItemDescription] = useState("");
//   const [isAvailable, setIsAvailable] = useState(true);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [categories, setCategories] = useState<
//     { label: string; value: string }[]
//   >([]);
//   const [showInput, setShowInput] = useState(false);
//   const [newCategory, setNewCategory] = useState("");
//   const [sizeOptionsPrices, setSizeOptionsPrices] = useState([
//     { id: 1, size: "", price: "" },
//   ]);
//   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
//   const [isSuccessOpen, setIsSuccessOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [categorySuccessMsg, setCategorySuccessMsg] = useState(""); // nova mensagem

//   const handleToggleAvailable = () => {
//     setIsAvailable((prev) => !prev);
//   };

//   const handleAddCategory = () => {
//     if (
//       newCategory.trim() &&
//       !categories.some(
//         (c) => c.label.toLowerCase() === newCategory.trim().toLowerCase()
//       )
//     ) {
//       setCategories([
//         ...categories,
//         {
//           label: newCategory.trim(),
//           value: newCategory.trim().toLowerCase().replace(/\s+/g, "-"),
//         },
//       ]);
//       setNewCategory("");
//       setShowInput(false);
//       setCategorySuccessMsg("Categoria adicionada com sucesso!");
//       setTimeout(() => setCategorySuccessMsg(""), 2000);
//     }
//   };

//   // Adicionar novo campo de tamanho/preço
//   const handleAddSize = () => {
//     setSizeOptionsPrices((prev) => [
//       ...prev,
//       { id: Date.now(), size: "", price: "" },
//     ]);
//   };

//   // Remover campo de tamanho/preço
//   const handleRemoveSize = (id: number) => {
//     setSizeOptionsPrices((prev) =>
//       prev.length === 1 ? prev : prev.filter((opt) => opt.id !== id)
//     );
//   };

//   // Atualizar valor de tamanho/preço
//   const handleSizeChange = (id: number, value: string) => {
//     setSizeOptionsPrices((prev) =>
//       prev.map((opt) => (opt.id === id ? { ...opt, size: value } : opt))
//     );
//   };
//   const handlePriceChange = (id: number, value: string) => {
//     setSizeOptionsPrices((prev) =>
//       prev.map((opt) => (opt.id === id ? { ...opt, price: value } : opt))
//     );
//   };

//   const handleSubmit = async () => {
//     if (
//       !itemName ||
//       !imageFile ||
//       sizeOptionsPrices.some((opt) => !opt.size || !opt.price)
//     ) {
//       setErrorMessage("Preencha todos os campos obrigatórios.");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("name", itemName);
//       formData.append("description", itemDescription);
//       formData.append("isAvailable", String(isAvailable));
//       formData.append("imageUrl", imageFile);
//       formData.append("sizeOptionsPrices", JSON.stringify(sizeOptionsPrices));

//       await createItem(formData);
//       setIsConfirmOpen(false);
//       setIsSuccessOpen(true);

//       setItemName("");
//       setItemDescription("");
//       setIsAvailable(true);
//       setImageFile(null);
//       setCategories([]);
//       setNewCategory("");
//       setSizeOptionsPrices([{ id: 1, size: "", price: "" }]);
//       setErrorMessage("");
//     } catch (error) {
//       console.error("Erro ao criar item:", error);
//       setErrorMessage(
//         "Erro ao criar item. Verifique sua conexão ou tente novamente."
//       );
//     }
//   };

//   return (
//     <section className="bg-[#f5f5f5]">
//       <Header />
//       <Banner />
//       <TabbedSections
//         title="Cadastrar item"
//         onlyTitle={true}
//         data={[]}
//         getCategory={() => ""}
//         renderItem={() => null}
//       />
//       <div className="flex flex-col items-center w-3/5 max-w-5xl mx-auto min-h-[60vh] p-2 sm:p-4 gap-6 sm:gap-8">
//         <div className="w-full flex flex-col gap-4">
//           <h2 className="text-xl sm:text-2xl font-bold text-left">
//             Identificação
//           </h2>
//           <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6 sm:gap-8">
//             <label className="flex flex-col items-center cursor-pointer mb-4 md:mb-0">
//               <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-200 rounded-lg flex items-center justify-center">
//                 <img
//                   src="/placeholder.svg"
//                   alt="Adicionar imagem"
//                   className="w-12 h-12 sm:w-16 sm:h-16 opacity-60"
//                 />
//               </div>
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (file) setImageFile(file);
//                 }}
//               />
//             </label>
//             <div className="flex flex-col items-center md:items-start justify-center w-full md:w-3/5 max-w-full gap-4">
//               <InputLogin
//                 label={
//                   <>
//                     <span>Nome do item</span>{" "}
//                     <span className="text-red-600">*</span>
//                   </>
//                 }
//                 type="text"
//                 placeholder="Digite o nome do item"
//                 value={itemName}
//                 onChange={(e) => setItemName(e.target.value)}
//               />
//               <InputLogin
//                 label={
//                   <>
//                     <span>Descrição</span>{" "}
//                     <span className="text-gray-500">(opcional)</span>
//                   </>
//                 }
//                 type="text"
//                 placeholder="Ingredientes do item"
//                 value={itemDescription}
//                 onChange={(e) => setItemDescription(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="w-full flex flex-col gap-4">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
//             <h2 className="text-xl sm:text-2xl font-bold">Gerenciamento</h2>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={handleToggleAvailable}
//                 className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${
//                   isAvailable ? "bg-green-500" : "bg-gray-400"
//                 }`}
//                 type="button"
//               >
//                 <div
//                   className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
//                     isAvailable ? "translate-x-6" : ""
//                   }`}
//                 ></div>
//               </button>
//               <span className="text-sm font-medium min-w-[130px]">
//                 Produto {isAvailable ? "disponível" : "indisponível"}
//               </span>
//             </div>
//           </div>

//           <div className="flex flex-row flex-wrap items-center gap-3 w-full">
//             <div className="flex items-center gap-5 w-full sm:w-auto">
//               {categories.length === 0 ? (
//                 <span className="text-gray-500 text-sm">
//                   Nenhuma categoria cadastrada. Adicione uma categoria.
//                 </span>
//               ) : (
//                 <SelectDay label="Categorias" options={categories} />
//               )}
//               <button
//                 type="button"
//                 className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100 text-2xl text-green-600 font-bold"
//                 onClick={() => setShowInput((v) => !v)}
//                 title="Adicionar categoria"
//               >
//                 +
//               </button>
//             </div>
//             {showInput && (
//               <div className="flex flex-row items-center gap-2 mt-2 w-full sm:w-auto">
//                 <input
//                   type="text"
//                   className="border border-gray-300 rounded px-2 py-1 flex-1 min-w-[120px]"
//                   placeholder="Nova categoria"
//                   value={newCategory}
//                   onChange={(e) => setNewCategory(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") handleAddCategory();
//                   }}
//                   autoFocus
//                 />
//                 <button
//                   type="button"
//                   className="px-2 py-1 bg-green-600 text-white rounded"
//                   onClick={handleAddCategory}
//                 >
//                   Salvar
//                 </button>
//               </div>
//             )}
//             {categorySuccessMsg && (
//               <div className="text-green-700 bg-green-100 border border-green-300 rounded px-3 py-2 mt-2 w-full text-center">
//                 {categorySuccessMsg}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Novo bloco dinâmico de tamanhos e preços */}
//         <div className="w-full flex flex-col gap-4">
//           <button
//             type="button"
//             className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded w-fit mb-2"
//             onClick={handleAddSize}
//           >
//             <span className="text-xl font-bold">+</span> Adicionar tamanho
//           </button>
//           <div className="flex flex-col gap-4">
//             {sizeOptionsPrices.map((opt) => (
//               <div
//                 key={opt.id}
//                 className="flex flex-col items-center sm:flex-row sm-items-end gap-4"
//               >
//                 <SelectDay
//                   label="Tamanho"
//                   options={[
//                     { label: "Pequeno", value: "Pequeno" },
//                     { label: "Médio", value: "Médio" },
//                     { label: "Grande", value: "Grande" },
//                   ]}
//                   onChange={(value) => handleSizeChange(opt.id, value)}
//                 />
//                 <InputLogin
//                   label="Preço"
//                   type="number"
//                   placeholder="Digite o preço"
//                   value={opt.price}
//                   onChange={(e) => handlePriceChange(opt.id, e.target.value)}
//                 />
//                 {sizeOptionsPrices.length > 1 && (
//                   <div className="flex sm:items-end">
//                     <button
//                       type="button"
//                       className="h-10 px-4 py-2 bg-red-500 text-white rounded self-start sm:self-auto"
//                       onClick={() => handleRemoveSize(opt.id)}
//                     >
//                       Remover
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {errorMessage && (
//           <div className="bg-red-100 text-red-800 border border-red-300 p-4 rounded mt-4 w-full text-center">
//             {errorMessage}
//           </div>
//         )}

//         <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 mt-6">
//           <button
//             type="button"
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
//           >
//             Cancelar
//           </button>
//           <button
//             type="button"
//             onClick={() => setIsConfirmOpen(true)}
//             className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded"
//           >
//             Cadastrar Item
//           </button>
//         </div>
//       </div>

//       <ConfirmModal
//         message="Tem certeza que deseja cadastrar este item?"
//         buttonmsg="Confirmar Cadastro"
//         onConfirm={handleSubmit}
//         onCancel={() => setIsConfirmOpen(false)}
//         isOpen={isConfirmOpen}
//       />

//       <ConfirmModal
//         message="Item cadastrado com sucesso!"
//         buttonmsg="Fechar"
//         onConfirm={() => setIsSuccessOpen(false)}
//         onCancel={() => setIsSuccessOpen(false)}
//         isOpen={isSuccessOpen}
//       />
//     </section>
//   );
// }
