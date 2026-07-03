import {
  GithubUser,
  githubUsersSchema,
} from "@shared/github/github-user.schema";
import { getEnv } from "@shared/validators/env";

/**
 * Busca usuários públicos do GitHub. Em qualquer falha (rede, status não-2xx,
 * corpo inesperado), retorna `null` — nunca propaga o erro cru do `fetch`,
 * para o service traduzir em SERVICE_UNAVAILABLE.
 */
const listUsers = async (): Promise<GithubUser[] | null> => {
  try {
    const response = await fetch(getEnv().GITHUB_API_URL);
    if (!response.ok) return null;

    const payload = await response.json();
    const parsed = githubUsersSchema.safeParse(payload);
    if (!parsed.success) return null;

    return parsed.data;
  } catch {
    return null;
  }
};

/** Seleciona um usuário aleatório da lista (função pura, testável). */
const pickRandom = (users: GithubUser[]): GithubUser =>
  users[Math.floor(Math.random() * users.length)];

export default { listUsers, pickRandom };
