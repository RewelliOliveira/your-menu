import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Field } from "@/components/shared/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils";
import { useAuth } from "./auth-context";
import { AuthLayout } from "./AuthLayout";
import { PasswordInput } from "./PasswordInput";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", restaurantName: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (form.password !== form.confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await register({
        name: form.name,
        restaurantName: form.restaurantName,
        email: form.email,
        password: form.password,
      });
      toast.success("Conta criada! Vamos configurar seu restaurante.");
      navigate("/admin/settings/profile", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Crie sua conta" description="Em poucos minutos seu cardápio estará no ar.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field label="Nome completo" htmlFor="name">
          <Input id="name" autoComplete="name" placeholder="Maria da Silva" value={form.name} onChange={update("name")} maxLength={80} />
        </Field>
        <Field label="Nome do restaurante" htmlFor="restaurantName" hint="Usado também no endereço do seu cardápio.">
          <Input
            id="restaurantName"
            autoComplete="organization"
            placeholder="Cantina da Maria"
            value={form.restaurantName}
            onChange={update("restaurantName")}
            maxLength={60}
          />
        </Field>
        <Field label="E-mail" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@restaurante.com"
            value={form.email}
            onChange={update("email")}
            maxLength={120}
          />
        </Field>
        <Field label="Senha" htmlFor="password" hint="Mínimo de 8 caracteres.">
          <PasswordInput id="password" autoComplete="new-password" value={form.password} onChange={update("password")} maxLength={128} />
        </Field>
        <Field label="Confirme a senha" htmlFor="confirm" error={error}>
          <PasswordInput
            id="confirm"
            autoComplete="new-password"
            value={form.confirm}
            onChange={update("confirm")}
            aria-invalid={!!error}
            maxLength={128}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Criar conta
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/admin/login" className="font-semibold text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
