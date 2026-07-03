import { commonControllerFactory } from "@shared/api-patterns/controller-factory";
import itensService from "@modules/itens/services/itens.service";

const create = commonControllerFactory(itensService.create, "CREATED");
const list = commonControllerFactory(itensService.list, "OK");

export default { create, list };
