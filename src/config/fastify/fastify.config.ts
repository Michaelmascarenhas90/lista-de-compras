import { errorHandlingMiddleware } from "@shared/errorHandler/middlewares/error.middleware";
import { dataInterceptor } from "@shared/interceptors/data-interceptor";
import cors from "@fastify/cors";
import Fastify from "fastify";

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: "*" });

fastify.addHook("preSerialization", dataInterceptor());

fastify.setErrorHandler(errorHandlingMiddleware);

export const app = fastify;
