import { ButtonLogin } from "../components/ui/button-login";
import { InputLogin } from "../components/ui/input-login";

export function Cadastro() {
  return (
    <div className="flex flex-col text-center justify-center gap-10">
      <header className="flex flex-col gap-5">
        <div>logo aqui</div>
        <h3>Your menu</h3>
      </header>
      <main>
        <div>
          <InputLogin label="Email" placeholder="Digite seu email" />
        </div>
        <div>
          <InputLogin label="Senha" placeholder="Digite uma senha forte" />
        </div>
        <div>
          <InputLogin label="Repita sua senha" placeholder="Digite novamente" />
        </div>
        <p>Esqueceu sua senha?</p>
      </main>
      <footer>
        <ButtonLogin type="submit">Cadastrar</ButtonLogin>
        <p>
          ja possui uma conta? <span>Entre agora</span>
        </p>
      </footer>
    </div>
  );
}
