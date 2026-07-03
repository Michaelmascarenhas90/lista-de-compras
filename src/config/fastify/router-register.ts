import fs from "fs/promises";
import path from "path";
import { FastifyInstance } from "fastify";

const fileExists = async (filePath: string) =>
  fs
    .access(filePath)
    .then(() => true)
    .catch(() => false);

/**
 * Auto-registro por convenção: varre `src/modules/`, encontra
 * `<module>/routes/<module>.route.(ts|js)` e registra cada rota com
 * `prefix: <moduleName>`. Extensão por ambiente (ts em dev, js em prod).
 */
export const routesRegister = async (
  fastify: FastifyInstance,
  environment: string,
): Promise<void> => {
  const basePath = path.resolve(__dirname, "../../modules");
  const ext = environment === "production" ? "js" : "ts";
  const moduleNames = await fs.readdir(basePath);

  await Promise.all(
    moduleNames.map(async (moduleName) => {
      const routeFile = path.join(
        basePath,
        moduleName,
        "routes",
        `${moduleName}.route.${ext}`,
      );

      const exists = await fileExists(routeFile);
      if (!exists) return;

      const { default: routeHandler } = await import(routeFile);
      fastify.register(routeHandler, { prefix: moduleName });
    }),
  );
};
