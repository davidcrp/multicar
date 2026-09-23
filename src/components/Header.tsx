'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Logo } from './Logo';

const LINKS = [
  { href: '/#estoque', label: 'Estoque' },
  { href: '/#lojas', label: 'Lojas' },
  { href: '/#sobre', label: 'Sobre nós' },
  { href: '/#contato', label: 'Contato' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="header">
      <div className="header__bar">
        <Link href="/" className="header__logo" aria-label="MultiCar - início" onClick={close}>
          <Logo />
        </Link>
        <nav className={`nav${open ? ' is-open' : ''}`} id="nav">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={close}>
              {l.label}
            </Link>
          ))}
          <Link href="/#contato" className="btn btn--red nav__cta-mobile" onClick={close}>
            Entre em contato
          </Link>
        </nav>
        <Link href="/#contato" className="btn btn--red header__cta">
          Entre em contato
        </Link>
        <button
          className="header__toggle"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
