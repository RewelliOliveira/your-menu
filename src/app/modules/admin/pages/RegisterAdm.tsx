import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/app/components/ui/Button";
import { InputLogin } from "../components/InputLogin";
import { createAccount } from "@/infrastructure/services/auth-service";

export function RegisterAdm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isFullNameValid = (name: string) => {
    const parts = name.trim().split(" ").filter((p) => p.length > 1);
    return parts.length >= 2;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      toast.warn("Preencha todos os campos obrigatórios!");
      return;
    }

    if (!isFullNameValid(fullName)) {
      toast.warn("Por favor, informe nome e sobrenome.");
      return;
    }

    if (password !== confirmPassword) {
      toast.warn("As senhas não coincidem!");
      return;
    }

    setIsLoading(true);

    try {
      await createAccount({ email, password, fullName });
      toast.success("Cadastro realizado com sucesso! Faça login.");
      navigate("/adm");
    } catch {
      toast.error("Erro ao cadastrar usuário!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <header className="flex flex-col items-center gap-3 mb-6">
          <img src="/logo.svg" alt="Logo YourMenu" className="w-48 h-auto" />
          <h1 className="text-xl font-bold text-gray-800">Crie sua conta</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputLogin
            label="Nome Completo *"
            placeholder="Ex: João da Silva"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <InputLogin
            label="Email *"
            placeholder="email@dominio.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <InputLogin
            label="Senha *"
            placeholder="Crie uma senha segura"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <InputLogin
            label="Repita sua senha *"
            placeholder="Digite novamente"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            size="full"
            disabled={isLoading}
            className="mt-2"
          >
            {isLoading ? "Cadastrando..." : "Cadastrar Restaurante"}
          </Button>
        </form>

        <footer className="mt-6 text-center text-sm text-gray-600 border-t border-gray-100 pt-4">
          Já tem uma conta?{" "}
          <Link to="/adm" className="text-orange-600 font-bold hover:underline">
            Entre agora
          </Link>
        </footer>
      </div>
    </div>
  );
}
