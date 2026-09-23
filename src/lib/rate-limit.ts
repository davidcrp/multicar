import 'server-only';
import { createHash } from 'node:crypto';
import { and, count, eq, gte } from 'drizzle-orm';
import { headers } from 'next/headers';
import { db } from '@/db';
import { leads, loginAttempts } from '@/db/schema';

/** IP do visitante, guardado só como hash (não armazenamos o IP em si). */
export async function ipHash() {
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'desconhecido';
  return createHash('sha256')
    .update(`${ip}:${process.env.SESSION_SECRET ?? ''}`)
    .digest('hex');
}

const minutosAtras = (m: number) => new Date(Date.now() - m * 60_000);

export const LOGIN_MAX_FALHAS = 5;
export const LOGIN_JANELA_MIN = 15;

export async function loginBloqueado(hash: string) {
  const [r] = await db
    .select({ n: count() })
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.ipHash, hash),
        eq(loginAttempts.success, false),
        gte(loginAttempts.createdAt, minutosAtras(LOGIN_JANELA_MIN)),
      ),
    );
  return r.n >= LOGIN_MAX_FALHAS;
}

export async function registrarLogin(hash: string, success: boolean) {
  await db.insert(loginAttempts).values({ ipHash: hash, success });
}

export async function leadsRecentes(hash: string) {
  const [r] = await db
    .select({ n: count() })
    .from(leads)
    .where(and(eq(leads.ipHash, hash), gte(leads.createdAt, minutosAtras(10))));
  return r.n;
}
