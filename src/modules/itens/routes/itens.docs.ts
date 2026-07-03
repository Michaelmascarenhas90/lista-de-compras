import {
  errorResponseSchema,
  itemSchema,
} from "@shared/docs/common-schemas";

export const createItemDocs = {
  tags: ["itens"],
  summary: "Cria um item no catálogo",
  body: {
    type: "object",
    required: ["nome", "preco", "qtd_atual"],
    properties: {
      nome: { type: "string", minLength: 1 },
      preco: { type: "number", minimum: 0 },
      qtd_atual: { type: "integer", minimum: 0 },
    },
  },
  response: {
    201: itemSchema,
    400: errorResponseSchema,
  },
} as const;

export const listItensDocs = {
  tags: ["itens"],
  summary: "Lista os itens do catálogo",
  response: {
    200: { type: "array", items: itemSchema },
  },
} as const;
