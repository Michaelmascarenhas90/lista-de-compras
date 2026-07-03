import { success } from "@shared/api-patterns/standard-api-patterns";
import { validateSchema } from "@shared/validators/data-against-schema";
import itensRepository from "@modules/itens/repositories/itens.repository";
import { createItemSchema } from "@modules/itens/schemas/create-item.schema";

const create = async (payload: unknown) => {
  const data = validateSchema(payload, createItemSchema);

  const item = await itensRepository.create(data);

  return success(item);
};

const list = async (_payload: unknown) => {
  const itens = await itensRepository.list();

  return success(itens);
};

export default { create, list };
