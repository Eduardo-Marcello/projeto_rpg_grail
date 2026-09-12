import "server-only";
import { cookies } from "next/headers";
import { getIronSession, type IronSession } from "iron-session";

// Sessão via cookie httpOnly assinado (iron-session), conforme decisão
// registrada em Tainted Grail/CLAUDE.md (login simples usuário/senha,
// sem provedor externo). Guia seguido:
// node_modules/next/dist/docs/01-app/02-guides/authentication.md

export interface SessionData {
  userId?: string;
  username?: string;
  role?: "PLAYER" | "GM";
}

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "tg_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
