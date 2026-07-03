import "dotenv/config";
import { app } from "@config/fastify/fastify.config";
import { routesRegister } from "@config/fastify/router-register";
import { validateEnv } from "@shared/validators/env";
import { databaseInit } from "@config/database/prisma";
import { ZodError } from "zod";

async function startServer() {
  try {
    const env = validateEnv();
    await databaseInit();
    await routesRegister(app, env.NODE_ENV);
    await app.listen({ port: env.SERVER_PORT, host: "0.0.0.0" });
  } catch (error) {
    if (error instanceof ZodError) {
      const fields = error.issues.map((issue) => issue.path.join(".")).join(", ");
      app.log.error(`Erro de env: ${fields}`);
    } else if (error instanceof Error) {
      app.log.error(`Erro da API: ${error.message}`);
    } else {
      app.log.error(`Erro desconhecido: ${String(error)}`);
    }
    process.exit(1);
  }
}

startServer();
