import { useState } from "react";

interface PersonalDataForm {
  nome: string;
  celular: string;
  telefone: string;
}

interface PersonalDataErrors {
  nome: string;
  celular: string;
}

export function usePersonalDataForm() {
  const [form, setForm] = useState<PersonalDataForm>({
    nome: "",
    celular: "",
    telefone: "",
  });
  const [errors, setErrors] = useState<PersonalDataErrors>({
    nome: "",
    celular: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof PersonalDataForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof PersonalDataErrors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const validate = () => {
    const newErrors: PersonalDataErrors = { nome: "", celular: "" };
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
