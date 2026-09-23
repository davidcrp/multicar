import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { cars } from '@/db/schema';
import { verifyAdmin } from '@/lib/dal';
import { nomeCarro } from '@/lib/format';
import { CarForm } from '../CarForm';

export default async function EditarCarroPage({ params }: PageProps<'/admin/carros/[id]'>) {
  await verifyAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [car] = await db.select().from(cars).where(eq(cars.id, id)).limit(1);
  if (!car) notFound();

  return (
    <>
      <div className="adm-head">
        <div>
          <Link href="/admin" className="adm-back">← Veículos</Link>
          <h1 className="display">{nomeCarro(car)}</h1>
          <p className="adm-muted">Endereço do anúncio: /carros/{car.slug}</p>
        </div>
      </div>
      <CarForm car={car} />
    </>
  );
}
