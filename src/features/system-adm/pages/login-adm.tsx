import { InputLogin } from "../components/ui/input-login";

export function LoginAdm() {
  return (
    <div>
      <h1>Login</h1>
      <form>
        <InputLogin placeholder="Digite seu email" label="Email" />
        <InputLogin placeholder="Digite sua senha" label="Senha" />
      </form>
    </div>
  );
}
