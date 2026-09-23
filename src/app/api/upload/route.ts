import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/dal';

const TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB por foto

// Gera o token para o navegador do admin enviar a foto direto ao Vercel Blob.
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdmin())) throw new Error('Não autorizado');
        if (!/^carros\/[\w-]+\.(jpe?g|png|webp|avif)$/i.test(pathname)) throw new Error('Nome de arquivo inválido');
        return {
          allowedContentTypes: TIPOS,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro no upload';
    return NextResponse.json({ error: msg }, { status: msg === 'Não autorizado' ? 401 : 400 });
  }
}
