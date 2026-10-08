import { useState } from "react";
import { maskPhone } from "@/core/utils/utils";

export interface PersonalDataFormState {
  nome: string;
  celular: string;
}

export interface PersonalDataFormErrors {
  nome: string;
  celular: string;
}

export function usePersonalDataForm() {
  const [form, setForm] = useState<PersonalDataFormState>({
    nome: "",
    celular: "",
  });
  const [errors, setErrors] = useState<PersonalDataFormErrors>({
    nome: "",
    celular: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof PersonalDataFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: PersonalDataFormErrors = { nome: "", celular: "" };
    if (!form.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }
    const celularDigits = form.celular.replace(/\D/g, "");
    if (!celularDigits) {
      newErrors.celular = "Celular é obrigatório";
    } else if (celularDigits.length < 10 || celularDigits.length > 11) {
      newErrors.celular = "Celular inválido";
    }
    setErrors(newErrors);
    return !newErrors.nome && !newErrors.celular;
  };

  return {
    form,
    setForm,
    errors,
    setErrors,
    isLoading,
    setIsLoading,
    handleChange,
    maskPhone,
    validate,
  };
}
