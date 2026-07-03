import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SERVER_PORT: z.coerce.number().int().positive().default(3000),
  DEBUG_MODE: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),
  GITHUB_API_URL: z.string().url().default("https://api.github.com/users"),
});

export type Env = z.infer<typeof envSchema>;

// NOTE: cache do env validado — parseado uma vez (no arranque, via validateEnv)
// e reusado como fonte única de configuração tipada em todo o app.
let cachedEnv: Env | null = null;

/** Valida as variáveis de ambiente no arranque (fail-fast: lança ZodError). */
export function validateEnv(): Env {
  cachedEnv = envSchema.parse(process.env);
  return cachedEnv;
}

/** Retorna o env validado; se ainda não foi validado, valida sob demanda. */
export function getEnv(): Env {
  return cachedEnv ?? validateEnv();
}
