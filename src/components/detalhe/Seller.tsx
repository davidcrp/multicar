'use client';

import { useState, useSyncExternalStore } from 'react';
import { LOJA } from '@/lib/loja';

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const fmtHora = (h: number) =>
  `${String(Math.floor(h)).padStart(2, '0')}h${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;

/** Dia da semana e hora atuais no fuso de Brasília, independente de onde o visitante está. */
function agoraBrasilia() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { dia, hora: Number(get('hour')) + Number(get('minute')) / 60 };
}

// Atualiza a cada minuto. Snapshot é uma string para ser comparável entre renders.
const subscribeMinuto = (cb: () => void) => {
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
};
const snapshotAgora = () => {
  const { dia, hora } = agoraBrasilia();
  return `${dia}|${hora}`;
};

export function StoreHours() {
  // No servidor não sabemos a hora do visitante; mostra texto neutro até carregar no navegador.
  const snap = useSyncExternalStore(subscribeMinuto, snapshotAgora, () => '');
  const now = snap ? { dia: Number(snap.split('|')[0]), hora: Number(snap.split('|')[1]) } : null;

  const range = now ? LOJA.horario[now.dia] : undefined;
  const aberta = !!(now && range && now.hora >= range[0] && now.hora < range[1]);

  return (
    <details className="hours">
      <summary>
        <i className={aberta ? 'is-open' : ''} />
        <span>
          {!now ? (
            'Horário de funcionamento'
          ) : aberta ? (
            <>
              <b>Loja aberta agora</b> - Fecha às {fmtHora(range![1])}
            </>
          ) : (
            <>
              <b>Loja fechada agora</b> - Veja os horários
            </>
          )}
        </span>
      </summary>
      <ul>
        {[1, 2, 3, 4, 5, 6, 0].map((d) => {
          const r = LOJA.horario[d];
          return (
            <li key={d} className={now?.dia === d ? 'is-today' : ''}>
              <span>{DIAS[d]}</span>
              <span>{r ? `${fmtHora(r[0])} às ${fmtHora(r[1])}` : 'Fechado'}</span>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

export function PhoneReveal() {
  const [shown, setShown] = useState(false);
  const digits = LOJA.telefone.replace(/\D/g, '');
  const [ddd, rest] = LOJA.telefone.split(' ');

  return (
    <div className="phone">
      <span className="phone__num">
        {shown ? (
          <a href={`tel:+55${digits}`}>{LOJA.telefone}</a>
        ) : (
          <>
            {ddd}{' '}
            <b>
              {rest.slice(0, 2)}
              <i>•••-••••</i>
            </b>
          </>
        )}
      </span>
      {shown ? (
        <a className="btn btn--dark" href={`tel:+55${digits}`}>
          Ligar agora
        </a>
      ) : (
        <button className="btn btn--dark" onClick={() => setShown(true)}>
          Ver telefone
        </button>
      )}
    </div>
  );
}
