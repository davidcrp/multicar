'use server';

import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { cars, leads } from '@/db/schema';
import { brl, nomeCarro } from '@/lib/format';
import { whatsappLink } from '@/lib/loja';
import { ipHash, leadsRecentes } from '@/lib/rate-limit';
import { leadSchema } from '@/lib/validation';

export type LeadState =
  | { status: 'idle' }
  | { status: 'error'; message: string; fields?: Record<string, string>; values?: Record<string, string> }
  | { status: 'ok'; whatsapp: string };

export async function enviarLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const raw = Object.fromEntries(formData);
  const values = {
    nome: String(raw.nome ?? '').slice(0, 100),
    email: String(raw.email ?? '').slice(0, 160),
    telefone: String(raw.telefone ?? '').slice(0, 30),
    mensagem: String(raw.mensagem ?? '').slice(0, 1000),
  };
  const parsed = leadSchema.safeParse(raw);

  if (!parsed.success) {
    // Robô preencheu o campo armadilha: finge sucesso e não grava nada.
    if (parsed.error.issues.some((i) => i.path[0] === 'site')) {
      return { status: 'ok', whatsapp: whatsappLink('Olá!') };
    }
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) fields[String(i.path[0])] ??= i.message;
    return { status: 'error', message: 'Confira os campos destacados.', fields, values };
  }

  const d = parsed.data;
  const hash = await ipHash();
  if ((await leadsRecentes(hash)) >= 5) {
    return { status: 'error', message: 'Muitas mensagens em pouco tempo. Tente novamente em alguns minutos.', values };
  }

  const [car] = await db
    .select({ id: cars.id, marca: cars.marca, modelo: cars.modelo, anoModelo: cars.anoModelo, preco: cars.preco })
    .from(cars)
    .where(and(eq(cars.id, d.carId), eq(cars.ativo, true)))
    .limit(1);
  if (!car) return { status: 'error', message: 'Este veículo não está mais disponível.' };

  const nome = nomeCarro(car);
  await db.insert(leads).values({
    carId: car.id,
    carNome: nome,
    nome: d.nome,
    email: d.email,
    telefone: d.telefone,
    mensagem: d.mensagem,
    aceitaOfertas: d.ofertas,
    ipHash: hash,
  });

  return {
    status: 'ok',
    whatsapp: whatsappLink(`${d.mensagem}\n\nVeículo: ${nome} - ${brl(car.preco)}\nNome: ${d.nome}`),
  };
}
