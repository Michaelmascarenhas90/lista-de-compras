import { FastifyReply, FastifyRequest } from "fastify";

/**
 * Remove recursivamente chaves sensíveis de qualquer resposta.
 * Preserva arrays e não converte Date (já normalizada em `parseResponseData`).
 */
const sanitizer = (payload: unknown, keysToRemove: string[]): unknown => {
  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizer(item, keysToRemove));
  }

  const isPlainObject =
    payload !== null &&
    typeof payload === "object" &&
    !(payload instanceof Date) &&
    !Buffer.isBuffer(payload);

  if (!isPlainObject) return payload;

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (keysToRemove.includes(key)) continue;
    result[key] = sanitizer(value, keysToRemove);
  }
  return result;
};

/** Hook `preSerialization` que remove as chaves informadas de toda a saída. */
export const dataInterceptor =
  (...keysToRemove: string[]) =>
  async (_req: FastifyRequest, _reply: FastifyReply, payload: unknown) =>
    sanitizer(payload, keysToRemove);
