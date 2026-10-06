import { Button } from "../components/ui/button";
import { InputLogin } from "../components/ui/input-login";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginAccount } from "@/services/login-account";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "react-toastify";

export function LoginAdm() {
  const [email, setEmail] = useState("admin@yourmenu.com");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    const credentials = { email, password };
    setIsLoading(true);

    try {
      const response = await loginAccount(credentials);
      const token = response.token;
      const restaurantId = response.restaurantId || "rest-mock-123";

      if (!token) {
        toast.error("Token de autenticação ausente na resposta!");
        return;
      }

      login(token, restaurantId);

      toast.success("Login realizado com sucesso! (Modo Mock)");
      navigate("/adm/edit-menu");
    } catch {
      toast.error("Erro ao tentar realizar login!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start gap-5 mx-auto max-w-md px-4 mt-20 lg:border-1 lg:min-h-0 lg:p-6 lg:gap-0 lg:rounded-[10px] lg:shadow">
      <header className="flex flex-col gap-5">
        <div className="justify-center items-center w-70 mx-auto">
          <img src="/logo.svg" alt="Logo YourMenu" />
        </div>
        <div className="bg-orange-50 border border-orange-200 text-orange-800 text-xs rounded-lg p-2.5 text-center">
          <strong>Modo Mock Ativado:</strong> Dados simulados para design. Use as credenciais padrão ou qualquer email/senha.
        </div>
      </header>

      <div className="mt-8 bg-white py-6 sm:py-6 rounded-lg px-4 lg:mt-0">
        <main>
          <InputLogin
            label="Email"
            placeholder="email@dominio.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputLogin
            label="Senha"
            placeholder="********"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="font-bold text-base text-right text-orange-600">
            Esqueceu sua senha?
          </p>
        </main>
      </div>

      <footer className="flex flex-col items-center gap-4 mt-6 lg:mt-3">
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        <div className="text-lg text-black">
          <p>
            Não tem uma conta?
            <Link to="/adm/register">
              <span className="text-orange-600 font-bold ml-1">Crie agora</span>
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
