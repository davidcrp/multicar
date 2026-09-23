'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { IconHeart, IconShare } from '../Icons';

const FAV_KEY = 'multicar-favoritos';
const FAV_EVENT = 'multicar-favoritos-change';

function rawFavs() {
  try {
    return localStorage.getItem(FAV_KEY) ?? '[]';
  } catch {
    return '[]';
  }
}

function readFavs(): string[] {
  try {
    const v = JSON.parse(rawFavs());
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function subscribe(cb: () => void) {
  window.addEventListener('storage', cb);
  window.addEventListener(FAV_EVENT, cb);
  return () => {
    window.removeEventListener('storage', cb);
    window.removeEventListener(FAV_EVENT, cb);
  };
}

export function FavShare({ slug, titulo }: { slug: string; titulo: string }) {
  // Favoritos ficam só no navegador do visitante. No servidor, começa "não favoritado".
  const raw = useSyncExternalStore(subscribe, rawFavs, () => '[]');
  const fav = raw.includes(`"${slug}"`);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const toggleFav = () => {
    const on = !fav;
    const favs = readFavs().filter((f) => f !== slug);
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(on ? [...favs, slug] : favs));
    } catch {
      /* sem storage (ex.: navegação privada): ignora */
    }
    window.dispatchEvent(new Event(FAV_EVENT));
  };

  const share = async () => {
    const url = location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, url });
      } catch {
        /* cancelado */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setToast('Link copiado!');
    } catch {
      setToast(url);
    }
  };

  return (
    <div className="dt-head__actions">
      <button className="icon-btn" aria-label="Compartilhar anúncio" onClick={share}>
        <IconShare />
      </button>
      <button className={`icon-btn${fav ? ' is-on' : ''}`} aria-label="Favoritar" aria-pressed={fav} onClick={toggleFav}>
        <IconHeart />
      </button>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
