import { z } from 'zod';
import { CAMBIOS, CARROCERIAS, COMBUSTIVEIS, CORES } from './loja';

const anoAtual = new Date().getFullYear();
const texto = (max: number) => z.string().trim().max(max);
const inteiro = (min: number, max: number) => z.coerce.number().int().min(min).max(max);
const inteiroOpcional = (min: number, max: number) =>
  z.preprocess((v) => (v === '' || v === null || v === undefined ? null : v), z.coerce.number().int().min(min).max(max).nullable());
const checkbox = z.preprocess((v) => v === 'on' || v === 'true' || v === true, z.boolean());

// Fotos: aceita só caminhos locais do site ou URLs do Vercel Blob.
const fotoUrl = z
  .string()
  .trim()
  .refine(
    (u) => /^\/assets\/img\/[\w\-/]+\.(jpe?g|png|webp|avif)$/i.test(u) ||
      /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/[\w\-/.%]+$/i.test(u),
    'Foto com endereço inválido',
  );

export const carSchema = z
  .object({
    marca: texto(60).min(1, 'Informe a marca'),
    modelo: texto(60).min(1, 'Informe o modelo'),
    versao: texto(160),
    cor: z.enum(CORES.map((c) => c.value) as [string, ...string[]]),
    preco: inteiro(1000, 50_000_000),
    fipe: inteiroOpcional(0, 50_000_000),
    media: inteiroOpcional(0, 50_000_000),
    anoFabricacao: inteiro(1950, anoAtual + 1),
    anoModelo: inteiro(1950, anoAtual + 2),
    km: inteiro(0, 2_000_000),
    cambio: z.enum(CAMBIOS),
    carroceria: z.enum(CARROCERIAS),
    combustivel: z.enum(COMBUSTIVEIS),
    finalPlaca: inteiroOpcional(0, 9),
    aceitaTroca: checkbox,
    unicoDono: checkbox,
    ipvaPago: checkbox,
    licenciado: checkbox,
    revisoes: checkbox,
    ativo: checkbox,
    itens: z.array(texto(60).min(1)).max(80),
    descricao: texto(2000),
    fotos: z.array(fotoUrl).min(1, 'Adicione pelo menos uma foto').max(30),
  })
  .refine((d) => d.anoModelo >= d.anoFabricacao, {
    message: 'Ano do modelo não pode ser menor que o de fabricação',
    path: ['anoModelo'],
  });

export type CarInput = z.infer<typeof carSchema>;

export const leadSchema = z.object({
  carId: z.coerce.number().int().positive(),
  nome: texto(100).min(2, 'Informe seu nome'),
  email: z.string().trim().max(160).email('E-mail inválido'),
  telefone: texto(30).regex(/^[\d\s()+-]{8,}$/, 'Telefone inválido'),
  mensagem: texto(1000).min(5, 'Escreva uma mensagem'),
  ofertas: checkbox,
  // Campo "armadilha" invisível: pessoas deixam vazio, robôs preenchem.
  site: z.string().max(0).optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(160),
  senha: z.string().min(1).max(200),
});
