import Image from 'next/image';
import Link from 'next/link';
import type { PublicCar } from '@/lib/cars';
import { anoTexto, brl, fmtKm, nomeCarro } from '@/lib/format';

export function CarCard({ car, index = 0 }: { car: PublicCar; index?: number }) {
  const href = `/carros/${car.slug}`;
  const nome = nomeCarro(car);
  return (
    <article className="card" style={{ animationDelay: `${index * 60}ms` }}>
      <Link className="card__img" href={href}>
        <Image src={car.fotos[0]} alt={nome} width={800} height={500} sizes="(max-width: 560px) 100vw, (max-width: 1024px) 50vw, 33vw" />
      </Link>
      <div className="card__body">
        <h3 className="card__title">{nome}</h3>
        <p className="card__price">{brl(car.preco)}</p>
        <p className="card__meta">
          Ano: {anoTexto(car)}
          <br />
          KM: {fmtKm(car.km)}
        </p>
        <Link className="btn btn--outline" href={href}>
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}
