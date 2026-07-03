import { statusCode } from "@shared/enums/status-code";
import { errorHandler } from "@shared/errorHandler/error-handler";
import { errorNamesToStatusCode } from "@shared/errorHandler/enums/error-name-table";
import { FastifyInstance, FastifyReply, FastifyRequest, FastifyError } from "fastify";
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
  const finalStatusCode = (error as FastifyError).statusCode ?? errStatusCode ?? statusCode.INTERNAL_SERVER_ERROR;
  
  const isKnownError = error.name in errorNamesToStatusCode;
  const isServerFault = finalStatusCode >= statusCode.INTERNAL_SERVER_ERROR;
  const safeMessage = (isServerFault && !isKnownError) 
    ? "Um erro desconhecido ocorreu, tente novamente." 
    : errMessage;

  reply.status(finalStatusCode).send({
    error: safeMessage || "Um erro desconhecido ocorreu, tente novamente.",
  });
}
