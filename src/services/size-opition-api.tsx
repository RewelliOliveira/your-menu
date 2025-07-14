import { api } from "./api";

export type SizeOptionApi = {
  id: number;
  magnitude: string;
  measureUnit: string;
  abbreviation: string;
};

export async function getSizeOptionsApi(
  token: string
): Promise<SizeOptionApi[]> {
  try {
    const response = await api.get("/sizeoptions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as SizeOptionApi[];
  } catch (error) {
    console.error("Erro ao buscar opções de tamanho:", error);
    throw error;
  }
}
