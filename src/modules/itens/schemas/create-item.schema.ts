import { z } from "zod";

export const createItemSchema = z
  .object({
    body: z.object({
      nome: z.string().min(1, "nome é obrigatório"),
      preco: z.number().nonnegative("preco não pode ser negativo"),
      qtd_atual: z
        .number()
        .int("qtd_atual deve ser inteiro")
        .nonnegative("qtd_atual não pode ser negativo"),
    }),
  })
  .transform((data) => data.body);

export type CreateItemSchema = z.infer<typeof createItemSchema>;
