import { commonControllerFactory } from "@shared/api-patterns/controller-factory";
import comprasService from "@modules/compras/services/compras.service";

const create = commonControllerFactory(comprasService.create, "CREATED");
const list = commonControllerFactory(comprasService.list, "OK");

export default { create, list };
