import { statusCode } from "@shared/enums/status-code";
import { errorHandler } from "@shared/errorHandler/error-handler";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

/**
 * Rede de segurança global (fastify.setErrorHandler): captura `throw` imprevistos
 * e `ZodError`. Anti-leak: nunca envia stack ao cliente.
 */
export async function errorHandlingMiddleware(
  this: FastifyInstance,
  error: Error,
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  if (process.env.DEBUG_MODE === "true") this.log.error(error);

  if (error instanceof ZodError) {
    reply.status(statusCode.BAD_REQUEST).send({
      error: "Houve um erro na validação dos campos, tente novamente.",
    });
    return;
  }

  const { errStatusCode, errMessage } = errorHandler(error);
  reply.status(errStatusCode || statusCode.INTERNAL_SERVER_ERROR).send({
    error: errMessage || "Um erro desconhecido ocorreu, tente novamente.",
  });
}
