import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, decrypt } from '@/lib/session';

function csp(nonce: string) {
  const dev = process.env.NODE_ENV === 'development';
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'nonce-${nonce}'${dev ? " 'unsafe-inline'" : ''}`,
    // Estilos em atributo (ex.: atraso de animação dos cards). Não executam código.
    `style-src-attr 'unsafe-inline'`,
    `img-src 'self' blob: data: https://*.public.blob.vercel-storage.com`,
    `font-src 'self'`,
    // Upload de fotos do painel vai direto para o Vercel Blob.
    `connect-src 'self' https://vercel.com https://*.blob.vercel-storage.com${dev ? ' ws:' : ''}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    ...(dev ? [] : ['upgrade-insecure-requests']),
  ].join('; ');
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Checagem rápida do painel (a checagem definitiva acontece em cada página/ação no servidor).
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = await decrypt(request.cookies.get(SESSION_COOKIE)?.value);
    if (!session) return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const policy = csp(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', policy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', policy);
  if (pathname.startsWith('/admin')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store');
  }
  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|assets/).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
