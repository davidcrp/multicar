'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IconChevronLeft, IconChevronRight } from '../Icons';

export function Gallery({ fotos, nome }: { fotos: string[]; nome: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(1);
  const [lb, setLb] = useState<number | null>(null);

  const step = () => {
    const slide = track.current?.querySelector<HTMLElement>('.dt-gallery__slide');
    return (slide?.offsetWidth ?? 0) + 8;
  };

  const move = (dir: 1 | -1) => {
    const t = track.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth - 2;
    if (dir === 1 && t.scrollLeft >= max) t.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir === -1 && t.scrollLeft <= 2) t.scrollTo({ left: t.scrollWidth, behavior: 'smooth' });
    else t.scrollBy({ left: dir * step(), behavior: 'smooth' });
  };

  const onScroll = () => {
    const t = track.current;
    if (t) setPos(Math.min(Math.round(t.scrollLeft / step()) + 1, fotos.length));
  };

  const showLb = useCallback((i: number) => setLb((i + fotos.length) % fotos.length), [fotos.length]);

  useEffect(() => {
    if (lb === null) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLb(null);
      if (e.key === 'ArrowLeft') showLb(lb - 1);
      if (e.key === 'ArrowRight') showLb(lb + 1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [lb, showLb]);

  return (
    <>
      <section className="dt-gallery" aria-label="Fotos do veículo">
        <div className="dt-gallery__track" ref={track} onScroll={onScroll}>
          {fotos.map((src, i) => (
            <button key={src + i} className="dt-gallery__slide" aria-label={`Ampliar foto ${i + 1}`} onClick={() => setLb(i)}>
              <Image src={src} alt={`${nome} - foto ${i + 1}`} width={1200} height={800} priority={i < 3} sizes="(max-width: 720px) 88vw, 33vw" />
            </button>
          ))}
        </div>
        <button className="dt-gallery__arrow dt-gallery__arrow--prev" aria-label="Foto anterior" onClick={() => move(-1)}>
          <IconChevronLeft />
        </button>
        <button className="dt-gallery__arrow dt-gallery__arrow--next" aria-label="Próxima foto" onClick={() => move(1)}>
          <IconChevronRight />
        </button>
        <span className="dt-gallery__count">
          {pos} / {fotos.length}
        </span>
      </section>

      {lb !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Foto ampliada" onClick={(e) => e.target === e.currentTarget && setLb(null)}>
          <button className="lightbox__close" aria-label="Fechar" onClick={() => setLb(null)}>
            &times;
          </button>
          <button className="dt-gallery__arrow dt-gallery__arrow--prev" aria-label="Foto anterior" onClick={() => showLb(lb - 1)}>
            <IconChevronLeft />
          </button>
          <Image src={fotos[lb]} alt={`${nome} - foto ${lb + 1}`} width={1800} height={1200} className="lightbox__img" sizes="100vw" />
          <button className="dt-gallery__arrow dt-gallery__arrow--next" aria-label="Próxima foto" onClick={() => showLb(lb + 1)}>
            <IconChevronRight />
          </button>
          <span className="lightbox__count">
            {lb + 1} / {fotos.length}
          </span>
        </div>
      )}
    </>
  );
}
