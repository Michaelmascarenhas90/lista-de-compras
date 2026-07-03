/** Fragmentos de JSON Schema reutilizáveis na documentação (Swagger/OpenAPI). */

export const errorResponseSchema = {
  type: "object",
  properties: {
    error: { type: "string" },
  },
} as const;

export const itemSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    nome: { type: "string" },
    preco: { type: "number" },
    qtd_atual: { type: "integer" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;
