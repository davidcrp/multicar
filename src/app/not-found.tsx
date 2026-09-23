import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import '@/styles/detalhes.css';

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="page-detalhe">
        <section className="dt-notfound">
          <h1 className="display">Página não encontrada</h1>
          <p>Esse anúncio pode ter sido vendido ou removido.</p>
          <Link className="btn btn--red btn--lg" href="/#estoque">
            Ver estoque
          </Link>
        </section>
      </div>
      <Footer />
    </>
  );
}
