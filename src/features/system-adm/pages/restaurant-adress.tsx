import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { restaurantAdressApi } from "@/services/restaurant-adress-api";
import { useState } from "react";
import { Header } from "../components/header";
import { Button } from "../components/ui/button";

export function RestaurantAdress() {
    const [cep, setCep] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [district, setDistrict] = useState("");
    const [complement, setComplement] = useState("");
    const [reference, setReference] = useState("");
    const { token } = useAuth();

    const handleSubmit = async () => {
        if (!cep || !state || !city || !street || !number || !district) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const data = {
                restaurantId: "123456",
                cep: parseInt(cep),
                state,
                city,
                street,
                number: parseInt(number),
                district,
                complement: complement || null,
                reference: reference || null,
            };

            if (!token) {
                alert("Usuário não autenticado.");
                return;
            }

            await restaurantAdressApi(data, token);
            alert("Endereço salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar endereço:", error);
            alert("Erro ao salvar endereço.");
        }
    };
    return (
        <div className="flex flex-col bg-[#f5f5f5] items-center min-h-screen gap-4">
            <Header/>
            <div className="bg-[FFFFFF] max-w-[75%] w-full p-10 rounded-2xl border border-black/20 shadow-sm">
                <h1 className="flex w-full justify-center text-2xl font-medium text-black/80 mb-8"> Informações de endereço</h1>
                <div className="flex gap-8">
                    <Input label="CEP*" type="text" value={cep} onChange={(e) => setCep(e.target.value)} />
                    <Input label="Estado*" type="text" value={state} onChange={(e) => setState(e.target.value)} />
                </div>
                <div className="flex gap-8 mt-4">
                    <Input label="Cidade*" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                    <Input label="Bairro*" type="text" value={district} onChange={(e) => setDistrict(e.target.value)} />
                </div>
                <div className="flex gap-8 mt-4">
                    <Input label="Rua*" type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
                    <Input label="Número" type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
                </div>
                <div className="flex gap-8 mt-4">
                    <Input label="Complemento" type="text" value={complement} onChange={(e) => setComplement(e.target.value)} />
                    <Input label="Referência" type="text" value={reference} onChange={(e) => setReference(e.target.value)} />
                </div>

                <div className="flex justify-end mt-6 w-full">
                    <Button onClick={handleSubmit} className="max-w-40 max-h-10 mt-3">Salvar</Button>
                </div>

            </div>
        </div>
    )
}