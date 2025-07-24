import { usePersonalDataForm } from "@/hooks/usePersonalDataForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export function PersonalData() {
  const {
    form,
    errors,
    isLoading,
    setIsLoading,
    handleChange,
    maskPhone,
    validate,
  } = usePersonalDataForm();

  const navigate = useNavigate();

  const handleContinue = async () => {
    if (validate()) {
      setIsLoading(true);
      try {
        toast.success("Dados enviados com sucesso!");
        navigate("/address-data"); 
      } catch {
        toast.error("Erro ao enviar dados");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRetirar = async () => {
    setIsLoading(true);
    try {
      // ...submit logic...
      toast.info("Opção: Retirar no Balcão");
    } catch {
      toast.error("Erro ao processar opção");
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !form.nome.trim() || !form.celular.trim() || isLoading;

  return (
    <section className="flex flex-col items-center justify-center w-full min-h-screen p-4 bg-white">
      <div className="flex flex-col items-center justify-around w-110 h-120 p-2 bg-[#f5f5f5] rounded-lg border border-gray-400 shadow-md">
        <div className="flex items-center justify-center w-full mb-4">
          <h1 className="text-2xl font-bold justify-self-auto">
            Dados pessoais
          </h1>
        </div>
        <div className="flex flex-col w-full gap-2 p-4">
          <Input
            label={
              <>
                Nome <span className="text-orange-600">*</span>
              </>
            }
            type="text"
            placeholder="Digite seu nome completo"
            value={form.nome}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("nome", e.target.value)
            }
            error={errors.nome}
            disabled={isLoading}
          />
          <Input
            label={
              <>
                Celular <span className="text-orange-600">*</span>
              </>
            }
            placeholder="(XX) XXXX-XXXX"
            type="tel"
            value={form.celular}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("celular", maskPhone(e.target.value))
            }
            error={errors.celular}
            disabled={isLoading}
          />
          <Input
            label="Telefone"
            type="tel"
            placeholder="(XX) XXXX-XXXX"
            value={form.telefone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("telefone", maskPhone(e.target.value))
            }
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center justify-between w-full p-4">
          <Button variant="dark" onClick={handleRetirar} disabled={isLoading}>
            {isLoading ? "Processando..." : "Retirar no Balcão"}
          </Button>
          <Button onClick={handleContinue} disabled={isDisabled}>
            {isLoading ? "Enviando..." : "Continuar"}
          </Button>
        </div>
      </div>
    </section>
  );
}
