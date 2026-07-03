import itensController from "@modules/itens/controllers/itens.controller";
import {
  createItemDocs,
  listItensDocs,
} from "@modules/itens/routes/itens.docs";
import { FastifyInstance } from "fastify";

async function itensRoute(fastify: FastifyInstance) {
  fastify.post("/", { schema: createItemDocs }, itensController.create);
  fastify.get("/", { schema: listItensDocs }, itensController.list);
}

export default itensRoute;
