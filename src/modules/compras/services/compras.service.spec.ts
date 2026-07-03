import { beforeEach, describe, expect, it, vi } from "vitest";
import comprasService from "@modules/compras/services/compras.service";
import comprasRepository from "@modules/compras/repositories/compras.repository";
import githubClient from "@shared/github/github.client";
import { errors } from "@shared/errorHandler/factory/errors.factory";

vi.mock("@modules/compras/repositories/compras.repository");
vi.mock("@shared/github/github.client");

const repositoryMock = vi.mocked(comprasRepository);
const githubMock = vi.mocked(githubClient);

const now = new Date();

const itemFixture = {
  id: 1,
  nome: "Café",
  preco: 19.9,
  qtd_atual: 5,
  createdAt: now,
  updatedAt: now,
};

const buyerFixture = {
  login: "octocat",
  avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
  html_url: "https://github.com/octocat",
};

const payload = { body: { item_id: 1 } };

describe("compras.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("cria a compra com comprador e item, retornando [null, data]", async () => {
      repositoryMock.findItemById.mockResolvedValue(itemFixture);
      githubMock.listUsers.mockResolvedValue([buyerFixture]);
      githubMock.pickRandom.mockReturnValue(buyerFixture);
      repositoryMock.decrementAndCreate.mockResolvedValue({
        id: 10,
        comprador_github_login: buyerFixture.login,
        item_id: 1,
        createdAt: now,
        updatedAt: now,
        item: itemFixture,
      });

      const [error, data] = await comprasService.create(payload);

      expect(error).toBeNull();
      expect(data).toMatchObject({
        id: 10,
        item_id: 1,
        comprador: buyerFixture,
        item: { id: 1, nome: "Café" },
      });
      expect(repositoryMock.decrementAndCreate).toHaveBeenCalledWith(
        1,
        buyerFixture.login,
      );
    });

    it("retorna NOT_FOUND (404) quando o item não existe", async () => {
      repositoryMock.findItemById.mockResolvedValue(null);

      const [error, data] = await comprasService.create(payload);

      expect(data).toBeNull();
      expect(error?.name).toBe(errors.names.NOT_FOUND);
      expect(githubMock.listUsers).not.toHaveBeenCalled();
      expect(repositoryMock.decrementAndCreate).not.toHaveBeenCalled();
    });

    it("retorna SERVICE_UNAVAILABLE (503) quando o GitHub está indisponível", async () => {
      repositoryMock.findItemById.mockResolvedValue(itemFixture);
      githubMock.listUsers.mockResolvedValue(null);

      const [error, data] = await comprasService.create(payload);

      expect(data).toBeNull();
      expect(error?.name).toBe(errors.names.SERVICE_UNAVAILABLE);
      expect(repositoryMock.decrementAndCreate).not.toHaveBeenCalled();
    });

    it("retorna PRECONDITION_FAILED (412) sem chamar o GitHub quando o estoque já está zerado", async () => {
      repositoryMock.findItemById.mockResolvedValue({
        ...itemFixture,
        qtd_atual: 0,
      });

      const [error, data] = await comprasService.create(payload);

      expect(data).toBeNull();
      expect(error?.name).toBe(errors.names.PRECONDITION_FAILED);
      expect(githubMock.listUsers).not.toHaveBeenCalled();
      expect(repositoryMock.decrementAndCreate).not.toHaveBeenCalled();
    });

    it("retorna PRECONDITION_FAILED (412) quando não há estoque", async () => {
      repositoryMock.findItemById.mockResolvedValue(itemFixture);
      githubMock.listUsers.mockResolvedValue([buyerFixture]);
      githubMock.pickRandom.mockReturnValue(buyerFixture);
      repositoryMock.decrementAndCreate.mockResolvedValue(null);

      const [error, data] = await comprasService.create(payload);

      expect(data).toBeNull();
      expect(error?.name).toBe(errors.names.PRECONDITION_FAILED);
    });
  });

  describe("list", () => {
    it("retorna as compras na dupla [null, data]", async () => {
      repositoryMock.list.mockResolvedValue([]);

      const [error, data] = await comprasService.list({});

      expect(error).toBeNull();
      expect(data).toEqual([]);
    });
  });
});
