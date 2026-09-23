import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { verifyAdmin } from '@/lib/dal';
import { logout } from '../actions';
import { AdminNav } from './AdminNav';
import '@/styles/admin.css';

export const metadata: Metadata = { title: 'Painel', robots: { index: false, follow: false } };

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  await verifyAdmin();
  return (
    <div className="adm">
      <header className="adm-top">
        <Link href="/admin" className="adm-top__logo" aria-label="Painel">
          <Logo variant="light" />
          <span>Painel</span>
        </Link>
        <AdminNav />
        <div className="adm-top__right">
          <Link href="/" target="_blank" className="adm-link">
            Ver site ↗
          </Link>
          <form action={logout}>
            <button className="adm-link adm-link--btn">Sair</button>
          </form>
        </div>
      </header>
      <main className="adm-main">{children}</main>
    </div>
  );
}
