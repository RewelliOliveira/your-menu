import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { InputLogin } from "../components/ui/input-login";
import { useState } from "react";
import { createAccount } from "@/services/create-account";

export function RegisterAdm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      alert('Preencha os campos obrigatorios.')
      return;
    }
    if (password !== confirmPassword) {
      alert('As senhas nao coincidem!');
      return;
    }
    try {
      const data = {
        email,
        password,
        fullName
      };

      await createAccount(data);
      alert("Cadastro realizado com sucesso!");
      navigate("/")
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro no cadastro.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col text-center justify-start gap-5 mx-auto max-w-md px-4 mt-20 lg:border-1 lg:min-h-0 lg:p-6 lg:gap-0 lg:rounded-[10px] lg:shadow">
      <header className="flex flex-col gap-5 ">
        <div className="justify-center items-center w-70 mx-auto">
          <img src="/logo.svg" alt="Logo YourMenu" />
        </div>
      </header>

      <div className="mt-8 bg-white py-6 sm:py-6 rounded-lg px-4 lg:mt-0">
        <main>
          <InputLogin label="Nome" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <InputLogin label="Email" placeholder="email@dominio.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputLogin label="Senha" placeholder="Digite uma senha forte" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <InputLogin label="Repita sua senha" placeholder="Digite novamente" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </main>
      </div>

      <footer className="flex flex-col items-center gap-4 mt-6 lg:mt-3">
        <Button type="submit" onClick={handleSubmit}>Cadastrar</Button>
        <div className="text-lg text-black">
          <p>
            Ja tem uma conta?
            <Link to="/">
              <span className="text-orange-600 font-bold ml-1">Entre agora</span>
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
