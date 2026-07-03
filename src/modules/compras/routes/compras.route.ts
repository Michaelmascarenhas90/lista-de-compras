import comprasController from "@modules/compras/controllers/compras.controller";
import {
  createCompraDocs,
  listComprasDocs,
} from "@modules/compras/routes/compras.docs";
import { FastifyInstance } from "fastify";

async function comprasRoute(fastify: FastifyInstance) {
  fastify.post("/", { schema: createCompraDocs }, comprasController.create);
  fastify.get("/", { schema: listComprasDocs }, comprasController.list);
}

export default comprasRoute;
