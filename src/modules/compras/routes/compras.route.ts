import comprasController from "@modules/compras/controllers/compras.controller";
import { FastifyInstance } from "fastify";

async function comprasRoute(fastify: FastifyInstance) {
  fastify.post("/", comprasController.create);
  fastify.get("/", comprasController.list);
}

export default comprasRoute;
