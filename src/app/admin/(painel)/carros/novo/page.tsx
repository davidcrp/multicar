import Link from 'next/link';
import { verifyAdmin } from '@/lib/dal';
import { CarForm } from '../CarForm';

export default async function NovoCarroPage() {
  await verifyAdmin();
  return (
    <>
      <div className="adm-head">
        <div>
          <Link href="/admin" className="adm-back">← Veículos</Link>
          <h1 className="display">Novo veículo</h1>
        </div>
      </div>
      <CarForm />
    </>
  );
}
