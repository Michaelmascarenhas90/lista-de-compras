import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";

/**
 * Registra @fastify/swagger + swagger-ui. Deve ser chamado ANTES do registro
 * das rotas para que os `schema` documentais de cada rota sejam coletados.
 * UI interativa disponível em `/docs`.
 */
export function registerSwagger(fastify: FastifyInstance): void {
  fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Lista de Compras Aleatórias com Catálogo",
        description:
          "API de catálogo de itens e lista de compras, onde cada compra " +
          "recebe um comprador aleatório da API pública do GitHub.",
        version: "1.0.0",
      },
      tags: [
        { name: "itens", description: "Catálogo de itens" },
        { name: "compras", description: "Lista de compras" },
      ],
    },
  });

  fastify.register(fastifySwaggerUi, { routePrefix: "/docs" });
}
