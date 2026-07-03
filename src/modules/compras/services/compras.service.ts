import { err, success } from "@shared/api-patterns/standard-api-patterns";
import { errors } from "@shared/errorHandler/factory/errors.factory";
import { validateSchema } from "@shared/validators/data-against-schema";
import githubClient from "@shared/github/github.client";
import comprasRepository from "@modules/compras/repositories/compras.repository";
import { createCompraSchema } from "@modules/compras/schemas/create-compra.schema";

const create = async (payload: unknown) => {
  const { item_id } = validateSchema(payload, createCompraSchema);

  const item = await comprasRepository.findItemById(item_id);
  if (!item) {
    return err(
      errors.messages.NOT_FOUND("Item"),
      errors.setStackAuto().getStack(),
      errors.names.NOT_FOUND,
    );
  }

  const users = await githubClient.listUsers();
  if (!users) {
    return err(
      errors.messages.SERVICE_UNAVAILABLE,
      errors.setStackAuto().getStack(),
      errors.names.SERVICE_UNAVAILABLE,
    );
  }

  const buyer = githubClient.pickRandom(users);

  const compra = await comprasRepository.decrementAndCreate(
    item_id,
    buyer.login,
  );
  if (!compra) {
    return err(
      errors.messages.INSUFFICIENT_STOCK(item.nome),
      errors.setStackAuto().getStack(),
      errors.names.PRECONDITION_FAILED,
    );
  }

  return success({
    ...compra,
    comprador: {
      login: buyer.login,
      avatar_url: buyer.avatar_url,
      html_url: buyer.html_url,
    },
  });
};

const list = async (_payload: unknown) => {
  const compras = await comprasRepository.list();

  return success(compras);
};

export default { create, list };
