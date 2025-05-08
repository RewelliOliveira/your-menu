import { Link } from "react-router-dom";
import { ButtonLogin } from "../components/ui/button";
import { InputLogin } from "../components/ui/input-login";
import { useState } from "react";
import { createAccount } from "@/services/account-service";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword) {
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
        fullName: "Maria do Carmo da Silva"
      };

      await createAccount(data);
      alert("Cadastro realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro no cadastro.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col text-center justify-start gap-5 mx-auto max-w-md px-4 mt-20">
      <header className="flex flex-col gap-5 ">
        <div className="justify-center w-70 sm:w-50 md:w-100 mx-auto">
          <img src="/logo.svg" alt="Logo YourMenu" />
        </div>
      </header>

      <div className="mt-8 bg-white py-6 sm:py-6 rounded-lg px-4 sm:px-4 md:px-8 lg:px-12">
        <main>
          <InputLogin label="Email" placeholder="email@dominio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputLogin label="Senha" placeholder="Digite uma senha forte" value={password} onChange={(e) => setPassword(e.target.value)} />
          <InputLogin label="Repita sua senha" placeholder="Digite novamente" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </main>
      </div>

      <footer className="flex flex-col items-center gap-4 mt-6">
        <ButtonLogin type="submit" onClick={handleSubmit}>Cadastrar</ButtonLogin>
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
