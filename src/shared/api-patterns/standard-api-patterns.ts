import { errors } from "@shared/errorHandler/factory/errors.factory";

export type SuccessResponse<T> = [null, T];
export type ErrorResponse = { message: string; stack: string; name: string };

/**
 * Resposta padrão de sucesso: [null, data].
 * Normaliza recursivamente todas as Date para ISO string (Buffer passa cru).
 */
export function success<T>(data: T): SuccessResponse<T> {
  if (Buffer.isBuffer(data)) {
    return [null, data];
  }
  return [null, parseResponseData(data)];
}

/**
 * Resposta padrão de erro: [{ message, stack, name }, null].
 * `name` é a chave que mapeia para o status HTTP (ver error-name-table).
 */
export function err(
  message: string,
  stack: string,
  name: string,
): [ErrorResponse, null] {
  return [{ message, stack, name }, null];
}

/**
 * Propaga um erro vindo de outro service, preservando o stack original.
 * Uso: const [e, r] = await outroService(x); if (e) return crossServicesErr(e);
 */
export function crossServicesErr(error: ErrorResponse): [ErrorResponse, null] {
  return err(
    error.message,
    errors.handleCrossServicesStack(error.stack),
    error.name,
  );
}

/** Converte recursivamente todas as Date de um objeto/array para ISO string. */
export function parseResponseData<T>(input: T): T {
  const convert = (value: unknown): unknown => {
    if (value instanceof Date) return value.toISOString();

    if (Array.isArray(value)) return value.map(convert);

    const isObjectNotNull = typeof value === "object" && value !== null;
    if (isObjectNotNull) {
      return Object.entries(value).reduce(
        (acc, [key, val]) => {
          acc[key] = convert(val);
          return acc;
        },
        {} as Record<string, unknown>,
      );
    }
    return value;
  };
  return convert(input) as T;
}
