import { isObject } from "./storage";

export interface CepResult {
  street: string;
  district: string;
  city: string;
  state: string;
}

export async function lookupCep(cep: string, signal?: AbortSignal): Promise<CepResult | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (!isObject(data) || data.erro) return null;

    const text = (value: unknown) => (typeof value === "string" ? value.slice(0, 120) : "");
    return {
      street: text(data.logradouro),
      district: text(data.bairro),
      city: text(data.localidade),
      state: text(data.uf),
    };
  } catch {
    return null;
  }
}
