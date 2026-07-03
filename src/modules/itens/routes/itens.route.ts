import itensController from "@modules/itens/controllers/itens.controller";
import { FastifyInstance } from "fastify";

async function itensRoute(fastify: FastifyInstance) {
  fastify.post("/", itensController.create);
  fastify.get("/", itensController.list);
}

export default itensRoute;
