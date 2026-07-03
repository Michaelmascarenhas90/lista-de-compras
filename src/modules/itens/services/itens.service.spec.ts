import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import itensService from "@modules/itens/services/itens.service";
import itensRepository from "@modules/itens/repositories/itens.repository";

vi.mock("@modules/itens/repositories/itens.repository");

const repositoryMock = vi.mocked(itensRepository);

describe("itens.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("cria um item e retorna a dupla [null, data]", async () => {
      const now = new Date();
      const created = {
        id: 1,
        nome: "Café",
        preco: 19.9,
        qtd_atual: 5,
        createdAt: now,
        updatedAt: now,
      };
      repositoryMock.create.mockResolvedValue(created);

      const [error, data] = await itensService.create({
        body: { nome: "Café", preco: 19.9, qtd_atual: 5 },
      });

      expect(error).toBeNull();
      expect(data).toMatchObject({ id: 1, nome: "Café" });
      expect(repositoryMock.create).toHaveBeenCalledWith({
        nome: "Café",
        preco: 19.9,
        qtd_atual: 5,
      });
    });

    it("lança ZodError quando o corpo é inválido (não captura no service)", async () => {
      await expect(
        itensService.create({ body: { nome: "", qtd_atual: -1 } }),
      ).rejects.toBeInstanceOf(ZodError);

      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe("list", () => {
    it("retorna a lista de itens na dupla [null, data]", async () => {
      repositoryMock.list.mockResolvedValue([]);

      const [error, data] = await itensService.list({});

      expect(error).toBeNull();
      expect(data).toEqual([]);
    });
  });
});
