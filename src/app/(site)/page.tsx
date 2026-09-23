import Image from 'next/image';
import Link from 'next/link';
import { Stock } from '@/components/Stock';
import { listPublicCars } from '@/lib/cars';

export default async function HomePage() {
  const cars = await listPublicCars();

  return (
    <main>
      <section className="hero" id="inicio">
        <div className="container hero__grid">
          <div className="hero__text">
            <h1>As melhores ofertas de veículos para sua família</h1>
            <p>Navegue pelo site e encontre carros que cabem no seu bolso!</p>
          </div>
          <div className="hero__media">
            <div className="hero__blob" />
            <Image src="/assets/img/hero.jpg" alt="SUV branco em estrada" className="hero__car" width={1400} height={933} priority sizes="(max-width: 860px) 100vw, 55vw" />
          </div>
        </div>
      </section>

      <Stock cars={cars} />

      <section className="about" id="sobre">
        <div className="about__content">
          <h2 className="display">Conheça a nossa empresa</h2>
          <p>
            Conheça a história, valores e a essência da Multicar. Clique no botão abaixo e descubra o que nos torna únicos.
          </p>
          <Link href="/#lojas" className="btn btn--red btn--lg">
            Saber Mais
          </Link>
        </div>
      </section>
    </main>
  );
}
