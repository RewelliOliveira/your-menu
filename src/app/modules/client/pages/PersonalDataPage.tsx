import { usePersonalDataForm } from "@/app/hooks/use-personal-data-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

export function PersonalDataPage() {
  const {
    form,
    errors,
    isLoading,
    setIsLoading,
    handleChange,
    validate,
    maskPhone,
  } = usePersonalDataForm();

  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  const handleContinue = async () => {
    const cleanedPhone = form.celular.replace(/\D/g, "");
    if (validate()) {
      setIsLoading(true);
      try {
        const updateOrder = {
          ...order,
          orderClient: {
            name: form.nome,
            phone: cleanedPhone,
          },
        };
        navigate("/address-data", { state: { order: updateOrder } });
      } catch {
        toast.error("Erro ao processar dados pessoais");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRetirar = async () => {
    const cleanedPhone = form.celular.replace(/\D/g, "");

    if (!form.nome.trim() || cleanedPhone.length < 10 || cleanedPhone.length > 11) {
      toast.warn("Preencha seu nome e celular corretamente para retirar no balcão.");
      return;
    }

    setIsLoading(true);
    try {
      const updateOrder = {
        ...order,
        orderClient: {
          name: form.nome,
          phone: cleanedPhone,
        },
        orderAdress: {
          deliveryZoneId: 1,
          street: "Retirada no Balcão",
          number: "0",
          complement: "Balcão",
          cep: "00000000",
          reference: "Presencial",
        },
      };

      toast.info("Opção selecionada: Retirar no balcão.");
      navigate("/finalize-order", {
        state: {
          orderItems: updateOrder.orderItems || [],
          orderClient: updateOrder.orderClient,
          orderAdress: updateOrder.orderAdress,
        },
      });
    } catch {
      toast.error("Erro ao processar opção de retirada.");
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !form.nome.trim() || !form.celular.trim() || isLoading;

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
      <div className="flex flex-col w-full max-w-2xl p-6 md:p-8 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="border-b pb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Dados do Cliente</h1>
          <p className="text-xs text-gray-500 mt-1">
            Informe seus dados para contato e identificação do pedido
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label={
              <>
                Nome Completo <span className="text-orange-600">*</span>
              </>
            }
            type="text"
            placeholder="Digite seu nome completo"
            value={form.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            error={errors.nome}
            disabled={isLoading}
          />

          <Input
            label={
              <>
                WhatsApp / Celular <span className="text-orange-600">*</span>
              </>
            }
            placeholder="(11) 99999-9999"
            type="tel"
            value={form.celular}
            onChange={(e) => handleChange("celular", maskPhone(e.target.value))}
            error={errors.celular}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-100">
          <Button
            variant="secondary"
            onClick={handleRetirar}
            disabled={isLoading}
            type="button"
          >
            Retirar no Balcão
          </Button>

          <Button
            onClick={handleContinue}
            disabled={isDisabled}
            type="button"
          >
            {isLoading ? "Processando..." : "Entrega em Domicílio →"}
          </Button>
        </div>
      </div>
    </section>
  );
}
