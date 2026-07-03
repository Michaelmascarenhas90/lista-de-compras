import { z } from "zod";

/** Valida o corpo do `POST /compras` e achata em `{ item_id }`. */
export const createCompraSchema = z
  .object({
    body: z.object({
      item_id: z.coerce
        .number()
        .int("item_id deve ser inteiro")
        .positive("item_id deve ser positivo"),
    }),
  })
  .transform((data) => data.body);

export type CreateCompraSchema = z.infer<typeof createCompraSchema>;
