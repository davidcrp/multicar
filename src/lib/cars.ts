import 'server-only';
import { and, asc, desc, eq, ne } from 'drizzle-orm';
import { connection } from 'next/server';
import { db } from '@/db';
import { cars, type Car } from '@/db/schema';

/** Campos que o site público pode ver (DTO). */
export type PublicCar = Omit<Car, 'ativo' | 'createdAt' | 'updatedAt'>;

const publicColumns = {
  id: cars.id, slug: cars.slug, marca: cars.marca, modelo: cars.modelo, versao: cars.versao,
  cor: cars.cor, preco: cars.preco, fipe: cars.fipe, media: cars.media,
  anoFabricacao: cars.anoFabricacao, anoModelo: cars.anoModelo, km: cars.km,
  cambio: cars.cambio, carroceria: cars.carroceria, combustivel: cars.combustivel,
  finalPlaca: cars.finalPlaca, aceitaTroca: cars.aceitaTroca, unicoDono: cars.unicoDono,
  ipvaPago: cars.ipvaPago, licenciado: cars.licenciado, revisoes: cars.revisoes,
  itens: cars.itens, descricao: cars.descricao, fotos: cars.fotos,
};

export async function listPublicCars(): Promise<PublicCar[]> {
  await connection();
  return db.select(publicColumns).from(cars).where(eq(cars.ativo, true)).orderBy(desc(cars.createdAt), asc(cars.id));
}

export async function getPublicCar(slug: string): Promise<PublicCar | null> {
  await connection();
  const [car] = await db
    .select(publicColumns)
    .from(cars)
    .where(and(eq(cars.slug, slug), eq(cars.ativo, true)))
    .limit(1);
  return car ?? null;
}

export async function listRelated(car: PublicCar, limit = 3): Promise<PublicCar[]> {
  const others = await db
    .select(publicColumns)
    .from(cars)
    .where(and(eq(cars.ativo, true), ne(cars.id, car.id)));
  return others
    .sort(
      (a, b) =>
        Number(b.carroceria === car.carroceria) - Number(a.carroceria === car.carroceria) ||
        Math.abs(a.preco - car.preco) - Math.abs(b.preco - car.preco),
    )
    .slice(0, limit);
}

export async function countPublicCars() {
  const rows = await db.select({ id: cars.id }).from(cars).where(eq(cars.ativo, true));
  return rows.length;
}
