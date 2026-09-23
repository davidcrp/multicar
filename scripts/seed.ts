// Cadastra os veículos de exemplo no banco (só os que ainda não existem).
// Uso: npm run db:seed
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { cars, type NewCar } from '../src/db/schema';
import data from './seed-data.json';

config({ path: '.env.local' });

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurada (.env.local).');
  const db = drizzle(neon(process.env.DATABASE_URL));
  const result = await db
    .insert(cars)
    .values(data as NewCar[])
    .onConflictDoNothing({ target: cars.slug })
    .returning({ slug: cars.slug });
  console.log(`${result.length} veículo(s) cadastrado(s).`, result.map((r) => r.slug).join(', '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
