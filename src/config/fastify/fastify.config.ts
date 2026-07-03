import { errorHandlingMiddleware } from "@shared/errorHandler/middlewares/error.middleware";
import { dataInterceptor } from "@shared/interceptors/data-interceptor";
import cors from "@fastify/cors";
import Fastify from "fastify";

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: "*" });

// Anti-leak de saída: registrado sem chaves sensíveis reais (este domínio não tem),
// mas mantém o ponto de extensão e não quebra datas/arrays.
fastify.addHook("preSerialization", dataInterceptor());

fastify.setErrorHandler(errorHandlingMiddleware);

export const app = fastify;
