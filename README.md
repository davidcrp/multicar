# MultiCar

Site de revenda de veículos com painel administrativo.

**Site no ar:** https://carro-bice.vercel.app

- **Site público:** página inicial com estoque e filtros; página de detalhes de cada carro (`/carros/<slug>`).
- **Painel:** `/admin` — cadastrar, editar, ocultar e excluir veículos, enviar fotos e ver os contatos recebidos.

## Tecnologias

- [Next.js 16](https://nextjs.org) (Node.js) + TypeScript, hospedado na Vercel
- Banco Postgres ([Neon](https://neon.tech)) com [Drizzle ORM](https://orm.drizzle.team)
- Fotos no [Vercel Blob](https://vercel.com/docs/vercel-blob)

## Segurança

- Login do painel com senha guardada só como hash (bcrypt), sessão em cookie `httpOnly` + `SameSite=Strict`, assinada (JWT HS256) e válida por 8 h.
- Bloqueio de força bruta: 5 senhas erradas em 15 min bloqueiam o IP.
- Toda ação do painel confere a sessão no servidor (não só o `proxy`).
- Formulário de contato validado no servidor (zod), com limite de 5 envios / 10 min por IP e campo-armadilha contra robôs.
- IPs são guardados só como hash.
- Upload de fotos: só admin logado, só imagens (JPG/PNG/WebP/AVIF), até 8 MB.
- Cabeçalhos: Content-Security-Policy com nonce por requisição, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`.
- O painel não é indexado por buscadores.

## Rodar no computador

```bash
npm install
vercel env pull .env.local --environment=production   # ou preencha a partir de .env.example
npm run dev
```

Abra http://localhost:3000 (site) e http://localhost:3000/admin (painel).

## Comandos úteis

| Comando | O que faz |
|---|---|
| `npm run dev` | Site em modo desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run db:push` | Cria/atualiza as tabelas no banco a partir de `src/db/schema.ts` |
| `npm run db:seed` | Cadastra os veículos de exemplo (não duplica) |
| `npm run admin:hash -- "nova senha"` | Gera o valor de `ADMIN_PASSWORD_HASH` |

## Trocar a senha do painel

```bash
npm run admin:hash -- "sua nova senha forte"
vercel env rm ADMIN_PASSWORD_HASH production
vercel env add ADMIN_PASSWORD_HASH production   # cole o valor gerado
vercel deploy --prod
```

Para derrubar todas as sessões abertas, troque também o `SESSION_SECRET`.

## Onde editar

- Dados da loja (telefone, endereço, horários, WhatsApp): `src/lib/loja.ts`
- Visual: `src/styles/`
- Tabelas do banco: `src/db/schema.ts`
