import {
  errorResponseSchema,
  itemSchema,
} from "@shared/docs/common-schemas";

const compradorSchema = {
  type: "object",
  properties: {
    login: { type: "string" },
    avatar_url: { type: "string", format: "uri" },
    html_url: { type: "string", format: "uri" },
  },
} as const;

const compraBaseSchema = {
  id: { type: "integer" },
  comprador_github_login: { type: "string" },
  item_id: { type: "integer" },
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
} as const;

/** Resposta do POST: compra + item incluído + comprador rico (dados do GitHub). */
const compraCreatedSchema = {
  type: "object",
  properties: {
    ...compraBaseSchema,
    item: itemSchema,
    comprador: compradorSchema,
  },
} as const;

/** Resposta do GET: compra + item incluído (login já está na própria compra). */
const compraWithItemSchema = {
  type: "object",
  properties: {
    ...compraBaseSchema,
    item: itemSchema,
  },
} as const;

export const createCompraDocs = {
  tags: ["compras"],
  summary: "Registra uma compra com comprador aleatório do GitHub",
  body: {
    type: "object",
    required: ["item_id"],
    properties: {
      item_id: { type: "integer", minimum: 1 },
    },
  },
  response: {
    201: compraCreatedSchema,
    404: errorResponseSchema,
    412: errorResponseSchema,
    503: errorResponseSchema,
  },
} as const;

export const listComprasDocs = {
  tags: ["compras"],
  summary: "Lista as compras registradas",
  response: {
    200: { type: "array", items: compraWithItemSchema },
  },
} as const;
