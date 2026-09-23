'use client';

import { useMemo, useState } from 'react';
import type { PublicCar } from '@/lib/cars';
import { nomeCarro } from '@/lib/format';
import { CORES } from '@/lib/loja';
import { CarCard } from './CarCard';

type Sort = '' | 'price-asc' | 'price-desc' | 'year-desc' | 'km-asc';
type Filters = { q: string; cor: string; marca: string; sort: Sort };
const EMPTY: Filters = { q: '', cor: '', marca: '', sort: '' };

const sorters: Record<Exclude<Sort, ''>, (a: PublicCar, b: PublicCar) => number> = {
  'price-asc': (a, b) => a.preco - b.preco,
  'price-desc': (a, b) => b.preco - a.preco,
  'year-desc': (a, b) => b.anoModelo - a.anoModelo,
  'km-asc': (a, b) => a.km - b.km,
};

export function Stock({ cars }: { cars: PublicCar[] }) {
  // `draft` = o que está marcado no painel; `applied` = o que filtra a lista (botão "Aplicar").
  const [draft, setDraft] = useState<Filters>(EMPTY);
  const [applied, setApplied] = useState<Filters>(EMPTY);

  const marcas = useMemo(() => [...new Set(cars.map((c) => c.marca))].sort(), [cars]);
  const cores = useMemo(() => CORES.filter((c) => cars.some((car) => car.cor === c.value)), [cars]);

  const list = useMemo(() => {
    const q = applied.q.trim().toLowerCase();
    const filtered = cars.filter(
      (c) =>
        (!q || `${nomeCarro(c)} ${c.versao}`.toLowerCase().includes(q)) &&
        (!applied.cor || c.cor === applied.cor) &&
        (!applied.marca || c.marca === applied.marca),
    );
    return applied.sort ? [...filtered].sort(sorters[applied.sort]) : filtered;
  }, [cars, applied]);

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <section className="stock" id="estoque">
      <div className="container stock__grid">
        <aside className="filters">
          <h3 className="display">Filtros:</h3>
          <input
            type="search"
            className="filters__search"
            placeholder="Pesquise..."
            aria-label="Pesquisar veículo"
            value={draft.q}
            onChange={(e) => {
              set('q', e.target.value);
              setApplied((a) => ({ ...a, q: e.target.value }));
            }}
          />

          <div className="filters__group">
            <span className="filters__label">Cor</span>
            <div className="swatches">
              {cores.map((c) => (
                <label className="swatch" key={c.value}>
                  <input type="radio" name="cor" checked={draft.cor === c.value} onChange={() => set('cor', c.value)} />
                  <i style={{ ['--c' as string]: c.hex }} />
                  {c.label}
                </label>
              ))}
            </div>
          </div>

          <div className="filters__group">
            <span className="filters__label">Marca</span>
            <div className="brands">
              {marcas.map((m) => (
                <label className="brand" key={m}>
                  <input type="radio" name="marca" checked={draft.marca === m} onChange={() => set('marca', m)} />
                  {m}
                </label>
              ))}
            </div>
          </div>

          <select
            className="filters__select"
            aria-label="Ordenar"
            value={draft.sort}
            onChange={(e) => set('sort', e.target.value as Sort)}
          >
            <option value="">Ordenar</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="year-desc">Mais novos</option>
            <option value="km-asc">Menor KM</option>
          </select>

          <button className="btn btn--red btn--block" onClick={() => setApplied(draft)}>
            Aplicar filtros
          </button>
          <button
            className="filters__clear"
            type="button"
            onClick={() => {
              setDraft(EMPTY);
              setApplied(EMPTY);
            }}
          >
            Limpar filtros
          </button>
        </aside>

        <div>
          <h2 className="display stock__title">Carros disponíveis:</h2>
          <div className="cards">
            {list.map((c, i) => (
              <CarCard key={c.id} car={c} index={i} />
            ))}
          </div>
          {list.length === 0 && <p className="stock__empty">Nenhum veículo encontrado com esses filtros.</p>}
        </div>
      </div>
    </section>
  );
}
