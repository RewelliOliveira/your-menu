import { ButtonLogin } from "../components/ui/button-login";
import { InputLogin } from "../components/ui/input-login";

export function Cadastro() {
  return (
    <div className="min-h-screen flex flex-col text-center justify-start gap-5 mx-auto max-w-md px-4 pt-40 sm:pt-10 md:pt-40 lg:pt-70">
      <header className="flex flex-col gap-5 ">
        <div className="justify-center w-70 sm:w-50 md:w-100 mx-auto">
          <img src="/logo.svg" alt="Logo YourMenu" />
        </div>
      </header>

      <div className="mt-8 bg-white py-6 sm:py-6 rounded-lg px-4 sm:px-4 md:px-8 lg:px-12">
        <main>
          <InputLogin label="Email" placeholder="email@dominio.com" />
          <InputLogin label="Senha" placeholder="Digite uma senha forte" />
          <InputLogin label="Repita sua senha" placeholder="Digite novamente" />
        </main>
      </div>

      <footer className="flex flex-col items-center gap-4 mt-6">
        <ButtonLogin type="submit">Cadastrar</ButtonLogin>
        <div className="text-lg text-black">
          <p>
            Ja tem uma conta?
            <span className="text-orange-600 font-bold ml-1">Entre agora</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
