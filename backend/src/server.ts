import { app } from "./app";
import { env } from "./config/env";
import { ensureDatabase } from "./database/migrate";

ensureDatabase()
  .then(() => {
    app.listen(env.PORT, (error) => {
      if (error) {
        console.error(`Não foi possível iniciar a API na porta ${env.PORT}.`, error);
        process.exit(1);
      }
      console.log(`API rodando em http://localhost:${env.PORT}/api`);
    });
  })
  .catch((error) => {
    console.error("Falha ao preparar o banco de dados.", error);
    process.exit(1);
  });
