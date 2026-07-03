import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  SERVER_PORT: z.string().default("3000"),
  DEBUG_MODE: z.string().optional(),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),
  GITHUB_API_URL: z.string().url().default("https://api.github.com/users"),
});

export type Env = z.infer<typeof envSchema>;

/** Valida as variáveis de ambiente no arranque (fail-fast: lança ZodError). */
export function validateEnv(): Env {
  return envSchema.parse(process.env);
}
