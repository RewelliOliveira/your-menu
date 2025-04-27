import "tailwindcss";
import { ButtonLogin } from "../components/ui/button-login";
import { InputLogin } from "../components/ui/input-login";

export function LoginAdm() {
  return (
    <div className="min-h-screen flex flex-col text-center justify-center gap-10 mx-auto max-w-md px-4">
      <header className="flex flex-col gap-5 ">
        <div className="justify-center w-50 mx-auto">
          <img src="/logo.svg" alt="Logo YourMenu" />
        </div>
      </header>

      <div className="mt-8 bg-white py-8 rounded-lg px-6 sm:px-10">
        <main>
          <InputLogin label="Email" placeholder="email@dominio.com" />
          <InputLogin label="Senha" placeholder="********" />
          <p className="text-sm text-right text-orange-600">
            Esqueceu sua senha?
          </p>
        </main>
      </div>

      <footer>
        <ButtonLogin type="submit">Entrar</ButtonLogin>
        <p>
          Não possui uma conta? <span>Crie agora</span>
        </p>
      </footer>
    </div>
  );
}
