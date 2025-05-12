import { Button } from "../components/ui/button";
import { InputLogin } from "../components/ui/input-login";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginAccount } from "@/services/login-account";

export function LoginAdm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    try {
      const data = {
        email,
        password,
      };

      const response = await loginAccount(data);
      const token = response.token;

      if (token) {
        localStorage.setItem("token", token);
        alert("Login realizado com sucesso!");
        navigate("/profile-restaurante");
      } else {
        alert("Token não retornado pelo servidor.");
      }
    } catch (error) {
      console.error("Erro ao entrar:", error);
      alert("Erro no login.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-center justify-start gap-5 mx-auto max-w-md px-4 mt-20">
      <header className="flex flex-col gap-5 ">
        <div className="justify-center w-70 sm:w-50 md:w-100 mx-auto">
          <img src="/logo.svg" alt="Logo YourMenu" />
        </div>
      </header>

      <div className="mt-8 bg-white py-6 sm:py-6 rounded-lg px-4">
        <main>
          <InputLogin
            label="Email"
            placeholder="email@dominio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <InputLogin
            label="Senha"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className=" font-bold text-base text-right text-orange-600">
            Esqueceu sua senha?
          </p>
        </main>
      </div>

      <footer className="flex flex-col grid-rows-2 items-center gap-4 mt-6">
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
