import React, { useState } from "react";
import "tailwindcss";
import { ButtonLogin } from "../components/ui/button-login";
import { InputLogin } from "../components/ui/input-login";

export function LoginAdm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSenhaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(event.target.value);
  };

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Dados de login:", { email, senha });
    // Lógica de login aqui
  };

  return (
    <div className="flex flex-col text-center justify-center min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <header className="flex flex-col gap-5 items-center">
          <div className="rounded-full bg-gray-300 w-20 h-20 flex items-center justify-center text-gray-600">
            LOGO
          </div>
          <h3 className="text-xl font-medium text-gray-900">Your menu</h3>
        </header>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <main className="space-y-6">
            <div>
              <InputLogin
                label="Email"
                placeholder="Digite seu email"
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <InputLogin
                label="Senha"
                placeholder="Digite uma senha forte"
                type="password"
                value={senha}
                onChange={handleSenhaChange}
              />
            </div>
            <p>Esqueceu sua senha?</p>
          </main>

          <footer className="mt-6">
            <ButtonLogin type="submit">Entrar</ButtonLogin>
            <p className="mt-4 text-sm text-gray-500">
              Não possui uma conta?{" "}
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Crie agora
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
