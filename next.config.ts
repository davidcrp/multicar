import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async redirects() {
    // Endereços do site antigo (HTML estático) continuam funcionando.
    return [
      { source: '/index.html', destination: '/', permanent: true },
      {
        source: '/detalhes.html',
        has: [{ type: 'query', key: 'id', value: '(?<id>[a-z0-9-]+)' }],
        destination: '/carros/:id',
        permanent: true,
      },
      { source: '/detalhes.html', destination: '/#estoque', permanent: true },
    ];
  },
};

export default nextConfig;
