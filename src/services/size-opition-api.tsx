import { mockGetSizeOptions } from "@/mocks/products";

export type SizeOptionApi = {
  id: number;
  magnitude: string;
  measureUnit: string;
  abbreviation: string;
};

export async function getSizeOptionsApi(
  _token?: string
): Promise<SizeOptionApi[]> {
  const options = await mockGetSizeOptions();
  return options;
}
