import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { restaurantAdressApi, getRestaurantAdressApi } from "@/services/restaurant-adress-api";
import { getRestaurantProfileApi } from "@/services/restaurant-profile-api";
import { useState, useEffect } from "react";
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
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const { token } = useAuth();

    // Pega o ID do restaurante
    useEffect(() => {
        async function fetchRestaurantId() {
            if (!token) return;
            try {
                const restaurant = await getRestaurantProfileApi(token);
                setRestaurantId(restaurant.id);
            } catch (error) {
                console.error("Erro ao buscar o perfil do restaurante:", error);
            }
        }
        fetchRestaurantId();
    }, [token]);

    // Busca os dados de endereço assim que tiver o ID
    useEffect(() => {
        async function fetchAddress() {
            if (!restaurantId || !token) return;

            try {
                const adress = await getRestaurantAdressApi(restaurantId, token);

                setCep(adress.cep.toString());
                setState(adress.state);
                setCity(adress.city);
                setStreet(adress.street);
                setNumber(adress.number.toString());
                setDistrict(adress.district);
                setComplement(adress.complement ?? "");
                setReference(adress.reference ?? "");
            } catch (error) {
                console.error("Endereço ainda não cadastrado ou erro ao buscar:", error);
            }
        }

        fetchAddress();
    }, [restaurantId, token]);

    const handleSubmit = async () => {
        if (!cep || !state || !city || !street || !number || !district) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        if (!token) {
            alert("Usuário não autenticado.");
            return;
        }

        if (!restaurantId) {
            alert("ID do restaurante não disponível.");
            return;
        }

        try {
            const data = {
                restaurantId,
                cep: parseInt(cep),
                state,
                city,
                street,
                number: parseInt(number),
                district,
                complement: complement || null,
                reference: reference || null,
            };

            console.log("Enviando dados para a API:", data);

            await restaurantAdressApi(data, token);
            alert("Endereço salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar endereço:", error);
            alert("Erro ao salvar endereço.");
        }
    };

    return (
        <div className="flex flex-col bg-[#f5f5f5] items-center min-h-screen gap-4">
            <Header />
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
    );
}
