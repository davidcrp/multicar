import type { Metadata } from 'next';
import { Logo } from '@/components/Logo';
import { LoginForm } from './LoginForm';
import '@/styles/admin.css';

export const metadata: Metadata = { title: 'Entrar', robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="adm-login">
      <div className="adm-login__card">
        <Logo />
        <h1 className="display">Painel da loja</h1>
        <p>Entre para gerenciar o estoque e ver os contatos recebidos.</p>
        <LoginForm />
      </div>
    </main>
  );
}
