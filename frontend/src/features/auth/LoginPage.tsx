import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { Field } from "@/components/shared/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils";
import { DEMO_ACCOUNT } from "@/services/demo-service";
import type { LoginInput } from "@/types/auth";
import { useAuth } from "./auth-context";
import { AuthLayout } from "./AuthLayout";
import { PasswordInput } from "./PasswordInput";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn(credentials: LoginInput) {
    setError("");
    setLoading(true);
    try {
      await login(credentials);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    signIn({ email, password });
  }

  function signInWithDemo() {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    signIn(DEMO_ACCOUNT);
  }

  return (
    <AuthLayout title="Bem-vindo de volta" description="Entre para acompanhar os pedidos do seu restaurante.">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        ou
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-3">
        <Button type="button" variant="outline" size="lg" className="w-full" onClick={signInWithDemo} disabled={loading}>
          Entrar com a conta demo
        </Button>
        <Button type="button" variant="ghost" className="w-full text-muted-foreground" asChild>
          <Link to="/your-burger" target="_blank">
            Ver loja do cliente <ArrowUpRight />
          </Link>
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link to="/admin/register" className="font-semibold text-primary hover:underline">
          Cadastre seu restaurante
        </Link>
      </p>
    </AuthLayout>
  );
}
