import { prisma } from "@config/database/prisma";

/** Busca o item alvo da compra — usado para distinguir 404 (item inexistente). */
const findItemById = (item_id: number) =>
  prisma.item.findUnique({ where: { id: item_id } });

/**
 * Decrementa o estoque e cria a compra atomicamente.
 *
 * NOTE: o decremento é condicional (`qtd_atual > 0`) dentro de `$transaction`
 * para evitar estoque negativo em concorrência. Se `count === 0`, não havia
 * estoque (ou perdeu a corrida) e a compra não é criada — retorna `null`.
 */
const decrementAndCreate = (item_id: number, comprador_github_login: string) =>
  prisma.$transaction(async (tx) => {
    const decremented = await tx.item.updateMany({
      where: { id: item_id, qtd_atual: { gt: 0 } },
      data: { qtd_atual: { decrement: 1 } },
    });

    if (decremented.count === 0) return null;

    return tx.compra.create({
      data: { item_id, comprador_github_login },
      include: { item: true },
    });
  });

/** Lista as compras já com o item relacionado (via `include`, sem N+1). */
const list = () => prisma.compra.findMany({ include: { item: true } });

export default { findItemById, decrementAndCreate, list };
