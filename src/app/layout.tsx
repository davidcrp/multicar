import type { Metadata } from 'next';
import { Changa_One, Roboto } from 'next/font/google';
import { connection } from 'next/server';
import '@/styles/site.css';

const changa = Changa_One({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-changa',
  display: 'swap',
});

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://carro-bice.vercel.app'),
  title: { default: 'MultiCar | As melhores ofertas de veículos', template: '%s | MultiCar' },
  description: 'Navegue pelo site e encontre carros que cabem no seu bolso.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Toda página é gerada na hora: necessário para o nonce da Content-Security-Policy (ver src/proxy.ts).
  await connection();
  return (
    <html lang="pt-BR" className={`${changa.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
