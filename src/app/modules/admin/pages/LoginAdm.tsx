import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/Button";
import { InputLogin } from "../components/InputLogin";
import { loginAccount } from "@/infrastructure/services/auth-service";
import { useAuth } from "@/app/hooks/use-auth";
import { toast } from "react-toastify";

export function LoginAdm() {
  const [email, setEmail] = useState("admin@yourmenu.com");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email || !password) {
      toast.warn("Preencha todos os campos obrigatórios!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginAccount({ email, password });
      const token = response.token;
      const restaurantId = response.restaurantId || "rest-mock-123";

      if (!token) {
        toast.error("Token de autenticação não retornado!");
        return;
      }

      login(token, restaurantId);
      toast.success("Login realizado com sucesso! (Modo Mock)");
      navigate("/adm/orders");
    } catch {
      toast.error("Erro ao tentar realizar login!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <header className="flex flex-col items-center gap-4 mb-6">
          <img src="/logo.svg" alt="Logo YourMenu" className="w-48 h-auto" />
          <div className="w-full bg-orange-50 border border-orange-200 text-orange-800 text-xs rounded-xl p-3 text-center leading-relaxed">
            <strong>Modo Mock Ativado:</strong> Dados simulados para testes. Use as credenciais pré-preenchidas ou qualquer email/senha.
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputLogin
            label="Email"
            placeholder="email@dominio.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <InputLogin
            label="Senha"
            placeholder="********"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => toast.info("No modo mock, qualquer senha é válida.")}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
            >
              Esqueceu sua senha?
            </button>
          </div>

          <Button
            type="submit"
            size="full"
            disabled={isLoading}
            className="mt-2"
          >
            {isLoading ? "Entrando..." : "Entrar no Painel"}
          </Button>
        </form>

        <footer className="mt-6 text-center text-sm text-gray-600 border-t border-gray-100 pt-4">
          Não tem uma conta?{" "}
          <Link
            to="/adm/register"
            className="text-orange-600 font-bold hover:underline"
          >
            Crie agora
          </Link>
        </footer>
      </div>
    </div>
  );
}
