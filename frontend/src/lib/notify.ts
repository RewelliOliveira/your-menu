import { toast } from "sonner";
import { getErrorMessage } from "./utils";

export function notifyError(error: unknown, fallback?: string) {
  toast.error(getErrorMessage(error, fallback));
}

export async function copyToClipboard(text: string, successMessage = "Copiado!") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
  } catch {
    toast.error("Não foi possível copiar. Selecione o texto e copie manualmente.");
  }
}
