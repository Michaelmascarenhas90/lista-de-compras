import { errorHandler } from "@shared/errorHandler/error-handler";
import { ErrorResponse } from "@shared/api-patterns/standard-api-patterns";
import { statusCode as statusCodeEnum } from "@shared/enums/status-code";
import { FastifyReply, FastifyRequest } from "fastify";

type Service = (
  payload: unknown,
) => Promise<[err: ErrorResponse, data: null] | [err: null, data: unknown]>;

/**
 * Elimina o boilerplate do controller: extrai o payload da request
 * ({ body, query, params }), chama o service e trata a dupla `[error, data]`.
 * Sem contexto de auth (fora de escopo deste desafio).
 */
export const commonControllerFactory =
  (service: Service, statusCode: keyof typeof statusCodeEnum) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { body, query, params } = request;

    const [err, data] = await service({ body, query, params });

    if (err) {
      const { errStatusCode, errMessage } = errorHandler(err);
      return reply.status(errStatusCode).send({ error: errMessage });
    }

    return reply.status(statusCodeEnum[statusCode]).send(data);
  };
