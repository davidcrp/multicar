import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { CarCard } from '@/components/CarCard';
import { FavShare } from '@/components/detalhe/FavShare';
import { Gallery } from '@/components/detalhe/Gallery';
import { LeadForm } from '@/components/detalhe/LeadForm';
import { PhoneReveal, StoreHours } from '@/components/detalhe/Seller';
import { Simulator } from '@/components/detalhe/Simulator';
import { IconCar, IconChevronRight, IconPin, IconShield, IconStar, IconVideo, IconWhatsapp } from '@/components/Icons';
import { Logo } from '@/components/Logo';
import { countPublicCars, getPublicCar, listRelated } from '@/lib/cars';
import { anoTexto, brl, corLabel, fmtKm, nomeCarro } from '@/lib/format';
import { LOJA, whatsappLink } from '@/lib/loja';
import '@/styles/detalhes.css';

const getCar = cache(getPublicCar);

export async function generateMetadata({ params }: PageProps<'/carros/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCar(slug);
  if (!car) return { title: 'Veículo não encontrado' };
  const titulo = `${nomeCarro(car)} - ${brl(car.preco)}`;
  return {
    title: titulo,
    description: `${car.marca} ${car.modelo} ${car.versao}, ${anoTexto(car)}, ${fmtKm(car.km)} km. ${car.descricao}`.slice(0, 160),
    openGraph: { title: titulo, images: car.fotos.slice(0, 1) },
    alternates: { canonical: `/carros/${car.slug}` },
  };
}

export default async function CarPage({ params }: PageProps<'/carros/[slug]'>) {
  const { slug } = await params;
  const car = await getCar(slug);
  if (!car) notFound();

  const [related, total] = await Promise.all([listRelated(car), countPublicCars()]);
  const nome = nomeCarro(car);
  const simNao = (v: boolean) => (v ? 'Sim' : 'Não');
  const whats = whatsappLink(`Olá! Tenho interesse no ${nome} (${brl(car.preco)}). Ainda está disponível?`);

  const specs: [string, string | number, string?][] = [
    ['Cidade', LOJA.cidade, 'wide'],
    ['Ano', anoTexto(car)],
    ['KM', fmtKm(car.km)],
    ['Câmbio', car.cambio],
    ['Carroceria', car.carroceria],
    ['Combustível', car.combustivel],
    ['Final de placa', car.finalPlaca ?? '—'],
    ['Cor', corLabel(car.cor)],
    ['Aceita troca', simNao(car.aceitaTroca)],
    ['Único dono', simNao(car.unicoDono)],
    ['Revisões em concessionária', simNao(car.revisoes)],
    ['IPVA pago', simNao(car.ipvaPago)],
    ['Licenciado', simNao(car.licenciado)],
  ];

  const diffFipe = car.fipe ? car.fipe - car.preco : null;

  return (
    <div className="page-detalhe">
      <main className="dt">
        <Gallery fotos={car.fotos} nome={nome} />

        <div className="container dt-layout">
          <div className="dt-main">
            <article className="dt-card">
              <nav className="dt-breadcrumb" aria-label="Você está em">
                <Link href="/">Home</Link> / <Link href="/#estoque">Estoque</Link> / <span>{car.marca} {car.modelo}</span>
              </nav>
              <div className="dt-head">
                <div>
                  <h1 className="dt-title">
                    {car.marca} <span>{car.modelo}</span>
                  </h1>
                  <p className="dt-version">{car.versao}</p>
                </div>
                <FavShare slug={car.slug} titulo={nome} />
              </div>

              <dl className="specs">
                {specs.map(([k, v, cls]) => (
                  <div key={k} className={cls}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              {car.descricao && <p className="dt-desc">{car.descricao}</p>}

              <div className="dt-extra">
                <div className="dt-extra__top">
                  <span className="dt-label">Sobre os diferenciais do anúncio</span>
                  <span className="badge-online">● Online</span>
                </div>
                <div className="dt-extra__row">
                  <IconVideo className="dt-extra__icon" />
                  <div className="dt-extra__text">
                    <strong>Videochamada</strong>
                    <p>Agende um horário para ver o carro em vídeo!</p>
                  </div>
                  <a className="btn btn--red" target="_blank" rel="noopener noreferrer" href={whatsappLink(`Olá! Gostaria de agendar uma videochamada para ver o ${nome}.`)}>
                    Agendar videochamada
                  </a>
                </div>
              </div>
            </article>

            {car.itens.length > 0 && (
              <article className="dt-card">
                <span className="dt-label">Itens do veículo</span>
                <ul className="items">
                  {car.itens.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </article>
            )}

            <article className="dt-card seller">
              <div className="seller__info">
                <span className="dt-label">Sobre o vendedor</span>
                <div className="seller__name">
                  <span className="seller__avatar"><Logo /></span>
                  <div>
                    <strong>{LOJA.nomeVendedor}</strong>
                    <small><IconPin />{LOJA.cidade}</small>
                  </div>
                </div>
                <StoreHours />
                <PhoneReveal />
                <Link className="seller__all" href="/#estoque">
                  Ver todos os carros da loja <IconChevronRight />
                </Link>
              </div>
              <div className="seller__badges">
                <span className="dt-label">Conquistas</span>
                <div className="badges">
                  <div><IconStar /><span>No mercado desde <b>{LOJA.desde}</b></span></div>
                  <div><IconCar /><span><b>{total}</b> carros em estoque</span></div>
                  <div><IconShield /><span>Procedência <b>verificada</b></span></div>
                </div>
              </div>
            </article>

            {(car.fipe || car.media) && (
              <article className="dt-card dt-card--dark">
                <span className="dt-label">Compare os preços</span>
                <div className="compare">
                  <div>
                    <small>Valor anunciado</small>
                    <strong>{brl(car.preco)}</strong>
                    {diffFipe !== null && diffFipe !== 0 && (
                      <em className={diffFipe > 0 ? 'is-good' : ''}>
                        {brl(Math.abs(diffFipe))} {diffFipe > 0 ? 'abaixo' : 'acima'} da FIPE
                      </em>
                    )}
                  </div>
                  {car.media && (
                    <div>
                      <small>Média de mercado</small>
                      <strong>{brl(car.media)}</strong>
                      <em>Valor médio de carros iguais anunciados</em>
                    </div>
                  )}
                  {car.fipe && (
                    <div>
                      <small>Tabela FIPE</small>
                      <strong>{brl(car.fipe)}</strong>
                      <em>Valor de referência deste carro na Tabela FIPE</em>
                    </div>
                  )}
                </div>
                <p className="compare__note">Valores de referência aproximados, sujeitos a atualização.</p>
              </article>
            )}

            <Simulator preco={car.preco} nome={nome} />
          </div>

          <aside className="dt-side">
            <div className="dt-card price-box">
              <div className="price-box__top">
                <strong className="price-box__value">{brl(car.preco)}</strong>
                <a className="btn btn--red" href="#simulador">Ver parcelas</a>
              </div>
              <p className="price-box__hint">Envie uma mensagem ao vendedor</p>
              <LeadForm carId={car.id} />
              <a className="whats" href={whats} target="_blank" rel="noopener noreferrer">
                <IconWhatsapp /> Chamar no WhatsApp
              </a>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="container related">
            <h2 className="display stock__title">Você também pode gostar:</h2>
            <div className="cards">
              {related.map((r) => (
                <CarCard key={r.id} car={r} />
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="mobile-bar">
        <div>
          <small>Preço</small>
          <strong>{brl(car.preco)}</strong>
        </div>
        <a className="btn btn--red" href={whats} target="_blank" rel="noopener noreferrer">
          Tenho interesse
        </a>
      </div>
    </div>
  );
}
