import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Info } from "lucide-react";

import { Field } from "@/components/shared/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils";
import { useAuth } from "./auth-context";
import { AuthLayout } from "./AuthLayout";
import { PasswordInput } from "./PasswordInput";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from?.startsWith("/admin") ? from : "/admin", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Bem-vindo de volta" description="Entre para acompanhar os pedidos do seu restaurante.">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="flex gap-2.5 rounded-xl bg-accent p-3 text-xs leading-relaxed text-accent-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>
            <strong>Modo demonstração:</strong> use qualquer e-mail válido e uma senha com pelo menos 8 caracteres.
          </p>
        </div>

        <Field label="E-mail" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@restaurante.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={120}
            required
          />
        </Field>

        <Field label="Senha" htmlFor="password" error={error}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!error}
            maxLength={128}
            required
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Entrar
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link to="/admin/register" className="font-semibold text-primary hover:underline">
            Cadastre seu restaurante
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
