import {
  GithubUser,
  githubUsersSchema,
} from "@shared/github/github-user.schema";

const GITHUB_API_URL =
  process.env.GITHUB_API_URL || "https://api.github.com/users";

/**
 * Busca usuários públicos do GitHub. Em qualquer falha (rede, status não-2xx,
 * corpo inesperado), retorna `null` — nunca propaga o erro cru do `fetch`,
 * para o service traduzir em SERVICE_UNAVAILABLE.
 */
const listUsers = async (): Promise<GithubUser[] | null> => {
  try {
    const response = await fetch(GITHUB_API_URL);
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
