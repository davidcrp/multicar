import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, decrypt } from './session';

/** Garante que quem chama é o admin logado; caso contrário, manda para o login. */
export const verifyAdmin = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await decrypt(token);
  if (!session) redirect('/admin/login');
  return session;
});

/** Versão sem redirect, para Route Handlers. */
export async function isAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return (await decrypt(token)) !== null;
}
