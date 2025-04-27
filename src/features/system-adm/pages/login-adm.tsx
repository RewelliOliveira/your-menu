import "tailwindcss";
import { ButtonLogin } from "../components/ui/button-login";
import { InputLogin } from "../components/ui/input-login";

export function LoginAdm() {
  return (
    <div className="flex flex-col text-center justify-center gap-10">
      <header className="flex flex-col gap-5">
        <div>logo aqui</div>
        <h3>Your menu</h3>
      </header>
      <main>
        <div>
          <InputLogin label="Email" placeholder="email@dominio.com" />
        </div>
        <div>
          <InputLogin label="Senha" placeholder="********" />
        </div>
        <p>Esqueceu sua senha?</p>
      </main>
      <footer>
        <ButtonLogin type="submit">Entrar</ButtonLogin>
        <p>
          Não possui uma conta? <span>Crie agora</span>
        </p>
      </footer>
    </div>
  );
}
