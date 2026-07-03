import { errorHandlingMiddleware } from "@shared/errorHandler/middlewares/error.middleware";
import { dataInterceptor } from "@shared/interceptors/data-interceptor";
import { registerSwagger } from "@config/fastify/swagger";
import cors from "@fastify/cors";
import Fastify from "fastify";

const fastify = Fastify({ logger: true });

fastify.setValidatorCompiler(() => (data) => ({ value: data }));

fastify.register(cors, { origin: "*" });

// NOTE: swagger registrado aqui (antes de routesRegister no server.ts) para
// coletar os schemas documentais das rotas.
registerSwagger(fastify);

fastify.addHook("preSerialization", dataInterceptor());

fastify.setErrorHandler(errorHandlingMiddleware);

export const app = fastify;
