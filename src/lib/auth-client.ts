import { createAuthClient } from "better-auth/react";

// Cliente do Better Auth apontando para a API. As requisições levam o cookie de sessão
// (credentials: "include"), por isso a API só aceita a origem exata do front (CORS).
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333",
  fetchOptions: { credentials: "include" },
});

export const { signIn, signUp, signOut, useSession } = authClient;
