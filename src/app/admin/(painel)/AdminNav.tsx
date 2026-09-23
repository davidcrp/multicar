'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Veículos', match: (p: string) => p === '/admin' || p.startsWith('/admin/carros') },
  { href: '/admin/contatos', label: 'Contatos', match: (p: string) => p.startsWith('/admin/contatos') },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="adm-nav">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={l.match(path) ? 'is-active' : ''}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
