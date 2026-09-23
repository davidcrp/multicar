'use server';

import { timingSafeEqual } from 'node:crypto';
import { del } from '@vercel/blob';
import bcrypt from 'bcryptjs';
import { and, eq, like, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { cars, leads } from '@/db/schema';
import { verifyAdmin } from '@/lib/dal';
import { slugify } from '@/lib/format';
import { ipHash, loginBloqueado, registrarLogin } from '@/lib/rate-limit';
import { createSession, deleteSession } from '@/lib/session';
import { carSchema, loginSchema } from '@/lib/validation';

/* ---------------------------------------------------------------- login */

export type LoginState = { error?: string };

// Hash "falso" usado quando o e-mail não bate, para o tempo de resposta ser igual (evita descobrir o e-mail).
const DUMMY_HASH = '$2b$12$NBDRqmQF8mGFtSri7rPkPep3C5MKaVhs.woEWcQWZ/m/7R2Lpg/iu';

function adminHash() {
  const b64 = process.env.ADMIN_PASSWORD_HASH;
  if (!b64) throw new Error('ADMIN_PASSWORD_HASH não configurado. Rode `npm run admin:hash`.');
  return Buffer.from(b64, 'base64').toString('utf8');
}

function mesmoTexto(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const hash = await ipHash();
  if (await loginBloqueado(hash)) {
    return { error: 'Muitas tentativas erradas. Aguarde 15 minutos e tente de novo.' };
  }

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  const email = parsed.success ? parsed.data.email : '';
  const senha = parsed.success ? parsed.data.senha : '';
  const emailOk = !!process.env.ADMIN_EMAIL && mesmoTexto(email, process.env.ADMIN_EMAIL.trim().toLowerCase());
  const senhaOk = await bcrypt.compare(senha, emailOk ? adminHash() : DUMMY_HASH);

  if (!parsed.success || !emailOk || !senhaOk) {
    await registrarLogin(hash, false);
    return { error: 'E-mail ou senha incorretos.' };
  }

  await registrarLogin(hash, true);
  await createSession();
  redirect('/admin');
}

export async function logout() {
  await deleteSession();
  redirect('/admin/login');
}

/* --------------------------------------------------------------- carros */

export type CarFormState = { error?: string; fields?: Record<string, string> };

async function slugUnico(base: string, ignorarId?: number) {
  const s = slugify(base) || 'veiculo';
  const existentes = await db
    .select({ slug: cars.slug })
    .from(cars)
    .where(ignorarId ? and(like(cars.slug, `${s}%`), ne(cars.id, ignorarId)) : like(cars.slug, `${s}%`));
  const usados = new Set(existentes.map((e) => e.slug));
  if (!usados.has(s)) return s;
  let n = 2;
  while (usados.has(`${s}-${n}`)) n++;
  return `${s}-${n}`;
}

const isBlob = (u: string) => u.startsWith('https://') && u.includes('.blob.vercel-storage.com/');

async function apagarFotos(urls: string[]) {
  const blobs = urls.filter(isBlob);
  if (blobs.length === 0) return;
  try {
    await del(blobs);
  } catch (e) {
    console.error('Falha ao apagar fotos do Blob', e);
  }
}

export async function salvarCarro(_prev: CarFormState, formData: FormData): Promise<CarFormState> {
  await verifyAdmin();

  const idRaw = formData.get('id');
  const id = idRaw ? Number(idRaw) : undefined;
  if (id !== undefined && (!Number.isInteger(id) || id <= 0)) return { error: 'Veículo inválido.' };

  const raw = {
    ...Object.fromEntries(formData),
    itens: [
      ...new Set(
        [...formData.getAll('itemPadrao').map(String), ...String(formData.get('itensExtras') ?? '').split('\n')]
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    ],
    fotos: formData.getAll('fotos').map(String),
  };
  const parsed = carSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) fields[String(i.path[0])] ??= i.message;
    return { error: 'Confira os campos destacados.', fields };
  }
  const data = parsed.data;

  if (id) {
    const [atual] = await db.select({ fotos: cars.fotos }).from(cars).where(eq(cars.id, id)).limit(1);
    if (!atual) return { error: 'Veículo não encontrado.' };
    await db.update(cars).set({ ...data, updatedAt: new Date() }).where(eq(cars.id, id));
    await apagarFotos(atual.fotos.filter((f) => !data.fotos.includes(f)));
  } else {
    const slug = await slugUnico(`${data.marca}-${data.modelo}-${data.anoModelo}`);
    await db.insert(cars).values({ ...data, slug });
  }

  revalidatePath('/', 'layout');
  redirect('/admin?ok=salvo');
}

function idValido(v: FormDataEntryValue | null) {
  const id = Number(v);
  if (!Number.isInteger(id) || id <= 0) throw new Error('ID inválido');
  return id;
}

export async function alternarAtivo(formData: FormData) {
  await verifyAdmin();
  const id = idValido(formData.get('id'));
  const [c] = await db.select({ ativo: cars.ativo }).from(cars).where(eq(cars.id, id)).limit(1);
  if (c) await db.update(cars).set({ ativo: !c.ativo, updatedAt: new Date() }).where(eq(cars.id, id));
  revalidatePath('/', 'layout');
}

export async function excluirCarro(formData: FormData) {
  await verifyAdmin();
  const id = idValido(formData.get('id'));
  const [removido] = await db.delete(cars).where(eq(cars.id, id)).returning({ fotos: cars.fotos });
  if (removido) await apagarFotos(removido.fotos);
  revalidatePath('/', 'layout');
  redirect('/admin?ok=excluido');
}

/* ------------------------------------------------------------- contatos */

export async function marcarLido(formData: FormData) {
  await verifyAdmin();
  const id = idValido(formData.get('id'));
  const lido = formData.get('lido') === 'true';
  await db.update(leads).set({ lido }).where(eq(leads.id, id));
  revalidatePath('/admin/contatos');
}

export async function excluirLead(formData: FormData) {
  await verifyAdmin();
  const id = idValido(formData.get('id'));
  await db.delete(leads).where(eq(leads.id, id));
  revalidatePath('/admin/contatos');
}
