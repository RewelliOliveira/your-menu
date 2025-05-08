import "tailwindcss";
import { ButtonLogin } from "../components/ui/button";
import { InputLogin } from "../components/ui/input-login";
import { Link } from "react-router-dom";

export function LoginAdm() {
  return (
    <div className="min-h-screen flex flex-col text-center justify-start gap-5 mx-auto max-w-md px-4 mt-20">
      <header className="flex flex-col gap-5 ">
        <div className="justify-center w-70 sm:w-50 md:w-100 mx-auto">
          <img src="/logo.svg" alt="Logo YourMenu" />
        </div>
      </header>

      <div className="mt-8 bg-white py-6 sm:py-6 rounded-lg px-4">
        <main>
          <InputLogin label="Email" placeholder="email@dominio.com" />
          <InputLogin label="Senha" placeholder="********" />
          <p className=" font-bold text-base text-right text-orange-600">
            Esqueceu sua senha?
          </p>
        </main>
      </div>

      <footer className="flex flex-col grid-rows-2 items-center gap-4 mt-6">
        <ButtonLogin type="submit">Entrar</ButtonLogin>
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
