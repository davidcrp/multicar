'use client';

import { useState } from 'react';
import { brl, brlCentavos } from '@/lib/format';
import { TAXA_FINANCIAMENTO, whatsappLink } from '@/lib/loja';

const PRAZOS = [12, 24, 36, 48, 60];
const MAX_ENTRADA = 80;

export function Simulator({ preco, nome }: { preco: number; nome: string }) {
  const [pct, setPct] = useState(30);
  const [prazo, setPrazo] = useState(48);

  const entrada = Math.round((preco * pct) / 100);
  const financiado = preco - entrada;
  const i = TAXA_FINANCIAMENTO;
  const parcela = financiado === 0 ? 0 : (financiado * i) / (1 - (1 + i) ** -prazo);

  return (
    <article className="dt-card" id="simulador">
      <h2 className="display sim__title">Veja as parcelas desse veículo</h2>
      <p className="sim__sub">Tudo sem compromisso — ajuste a entrada e o prazo :)</p>
      <div className="sim">
        <div className="sim__controls">
          <label className="sim__field">
            <span>
              Entrada{' '}
              <b>
                {pct}% · {brl(entrada)}
              </b>
            </span>
            <input
              type="range"
              min={0}
              max={MAX_ENTRADA}
              step={5}
              value={pct}
              onChange={(e) => setPct(Number(e.target.value))}
              style={{ ['--p' as string]: `${(pct / MAX_ENTRADA) * 100}%` }}
            />
          </label>
          <div className="sim__field">
            <span>Prazo</span>
            <div className="sim__terms" role="group" aria-label="Prazo">
              {PRAZOS.map((n) => (
                <button key={n} type="button" className={n === prazo ? 'is-active' : ''} aria-pressed={n === prazo} onClick={() => setPrazo(n)}>
                  {n}x
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="sim__result">
          <small>Parcelas de</small>
          <strong>
            {prazo}x {brlCentavos(parcela)}
          </strong>
          <span>Valor financiado: {brl(financiado)}</span>
          <a
            className="btn btn--red btn--block"
            target="_blank"
            rel="noopener noreferrer"
            href={whatsappLink(`Olá! Quero financiar o ${nome} (${brl(preco)}) com entrada de ${brl(entrada)} em ${prazo}x.`)}
          >
            Quero financiar
          </a>
        </div>
      </div>
      <p className="sim__note">
        * Simulação estimada com taxa de {(TAXA_FINANCIAMENTO * 100).toLocaleString('pt-BR')}% a.m. Sujeita a análise de crédito.
      </p>
    </article>
  );
}
