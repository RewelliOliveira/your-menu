import { Button } from "../components/ui/button";
import { InputLogin } from "../components/ui/input-login";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginAccount } from "@/services/login-account";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "react-toastify";

export function LoginAdm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    const credentials = { email, password };

    try {
      const response = await loginAccount(credentials);
      const token = response.token;

      if (!token) {
        toast.error("Token de autenticação ausente na resposta!");
        return;
      }

      login(token);
      navigate("/profile-restaurant");
      toast.success("Login realizado com sucesso!");

    } catch (error) {
      toast.error("Erro ao tentar realizar login!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-center justify-start gap-5 mx-auto max-w-md px-4 mt-20 lg:border-1 lg:min-h-0 lg:p-6 lg:gap-0 lg:rounded-[10px] lg:shadow">
      <header className="flex flex-col gap-5">
        <div className="justify-center items-center w-70 mx-auto">
          <img src="/logo.svg" alt="Logo YourMenu" />
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
        <Button onClick={handleSubmit}>Entrar</Button>
        <div className="text-lg text-black">
          <p>
            Não tem uma conta?
            <Link to="/register">
              <span className="text-orange-600 font-bold ml-1">Crie agora</span>
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
