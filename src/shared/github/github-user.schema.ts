import { z } from "zod";

/** Campos do usuário do GitHub que interessam ao comprador de uma compra. */
export const githubUserSchema = z.object({
  login: z.string().min(1),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
});

export const githubUsersSchema = z.array(githubUserSchema);

export type GithubUser = z.infer<typeof githubUserSchema>;
