import { prisma } from "@config/database/prisma";
import { CreateItemSchema } from "@modules/itens/schemas/create-item.schema";

const create = (data: CreateItemSchema) => prisma.item.create({ data });

const list = () => prisma.item.findMany({ orderBy: { id: "asc" } });

export default { create, list };
