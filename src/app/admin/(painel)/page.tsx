import Image from 'next/image';
import Link from 'next/link';
import { count, desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { cars, leads } from '@/db/schema';
import { verifyAdmin } from '@/lib/dal';
import { brl, fmtKm, nomeCarro } from '@/lib/format';
import { alternarAtivo, excluirCarro } from '../actions';
import { ConfirmButton, PendingButton } from './ConfirmButton';

const MSGS: Record<string, string> = { salvo: 'Veículo salvo com sucesso.', excluido: 'Veículo excluído.' };

export default async function AdminCarsPage({ searchParams }: PageProps<'/admin'>) {
  await verifyAdmin();
  const { ok } = await searchParams;
  const [lista, [naoLidos]] = await Promise.all([
    db.select().from(cars).orderBy(desc(cars.createdAt), desc(cars.id)),
    db.select({ n: count() }).from(leads).where(eq(leads.lido, false)),
  ]);
  const ativos = lista.filter((c) => c.ativo).length;
  const msg = typeof ok === 'string' ? MSGS[ok] : undefined;

  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="display">Veículos</h1>
          <p className="adm-muted">
            {ativos} à venda · {lista.length - ativos} ocultos
            {naoLidos.n > 0 && (
              <>
                {' · '}
                <Link href="/admin/contatos" className="adm-badge">
                  {naoLidos.n} contato(s) novo(s)
                </Link>
              </>
            )}
          </p>
        </div>
        <Link href="/admin/carros/novo" className="btn btn--red adm-btn-lg">
          + Novo veículo
        </Link>
      </div>

      {msg && <p className="adm-success" role="status">{msg}</p>}

      {lista.length === 0 ? (
        <div className="adm-empty">
          <p>Nenhum veículo cadastrado ainda.</p>
          <Link href="/admin/carros/novo" className="btn btn--red">Cadastrar o primeiro</Link>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Veículo</th>
                <th>Preço</th>
                <th>KM</th>
                <th>Status</th>
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {lista.map((c) => (
                <tr key={c.id} className={c.ativo ? '' : 'is-off'}>
                  <td>
                    <div className="adm-car">
                      {c.fotos[0] && <Image src={c.fotos[0]} alt="" width={96} height={64} />}
                      <div>
                        <strong>{nomeCarro(c)}</strong>
                        <small>{c.versao}</small>
                      </div>
                    </div>
                  </td>
                  <td>{brl(c.preco)}</td>
                  <td>{fmtKm(c.km)}</td>
                  <td>
                    <span className={`adm-status ${c.ativo ? 'is-on' : ''}`}>{c.ativo ? 'À venda' : 'Oculto'}</span>
                  </td>
                  <td>
                    <div className="adm-actions">
                      <Link href={`/admin/carros/${c.id}`} className="adm-link">Editar</Link>
                      {c.ativo && (
                        <Link href={`/carros/${c.slug}`} target="_blank" className="adm-link">Ver ↗</Link>
                      )}
                      <form action={alternarAtivo}>
                        <input type="hidden" name="id" value={c.id} />
                        <PendingButton className="adm-link adm-link--btn">{c.ativo ? 'Ocultar' : 'Publicar'}</PendingButton>
                      </form>
                      <form action={excluirCarro}>
                        <input type="hidden" name="id" value={c.id} />
                        <ConfirmButton className="adm-link adm-link--btn adm-link--danger" message={`Excluir "${nomeCarro(c)}" e suas fotos? Não dá para desfazer.`}>
                          Excluir
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
