import { statusCode } from "@shared/enums/status-code";
import { errorNamesToStatusCode } from "@shared/errorHandler/enums/error-name-table";
import { getEnv } from "@shared/validators/env";

interface HandledError {
  message: string;
  stack?: string;
  name: string;
}

/**
 * Traduz a dupla-erro em `{ errStatusCode, errMessage }`.
 * Anti-leak: só inclui o stack quando `DEBUG_MODE=true`.
 */
export function errorHandler({ message, stack, name }: HandledError) {
  const isDebugMode = getEnv().DEBUG_MODE;

  const code =
    errorNamesToStatusCode[name as keyof typeof errorNamesToStatusCode] || null;

  const errorResponse = {
    errMessage: message,
    errStatusCode: code || statusCode.INTERNAL_SERVER_ERROR,
  };

  return isDebugMode ? { ...errorResponse, stack } : errorResponse;
}
