import * as z from "zod";

/** Valida e infere o tipo. Lança ZodError (capturado pelo middleware global). */
export function validateSchema<T extends z.ZodType>(
  data: unknown,
  schema: T,
): z.infer<T> {
  return schema.parse(data);
}

/** Versão para schemas com refinamentos assíncronos. */
export async function validateSchemaAsync<T extends z.ZodType>(
  data: unknown,
  schema: T,
): Promise<z.infer<T>> {
  return schema.parseAsync(data);
}
