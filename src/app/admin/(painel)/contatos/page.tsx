import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { cars, leads } from '@/db/schema';
import { verifyAdmin } from '@/lib/dal';
import { excluirLead, marcarLido } from '../../actions';
import { ConfirmButton, PendingButton } from '../ConfirmButton';

const dataHora = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' });

export default async function ContatosPage() {
  await verifyAdmin();
  const lista = await db
    .select({
      id: leads.id, nome: leads.nome, email: leads.email, telefone: leads.telefone, mensagem: leads.mensagem,
      aceitaOfertas: leads.aceitaOfertas, lido: leads.lido, createdAt: leads.createdAt, carNome: leads.carNome,
      carSlug: cars.slug,
    })
    .from(leads)
    .leftJoin(cars, eq(leads.carId, cars.id))
    .orderBy(desc(leads.createdAt))
    .limit(300);

  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="display">Contatos</h1>
          <p className="adm-muted">Mensagens enviadas pelo formulário dos anúncios.</p>
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="adm-empty"><p>Nenhum contato recebido ainda.</p></div>
      ) : (
        <div className="adm-leads">
          {lista.map((l) => {
            const tel = l.telefone.replace(/\D/g, '');
            const wa = tel.length >= 10 ? `https://wa.me/${tel.startsWith('55') ? tel : `55${tel}`}` : null;
            return (
              <article key={l.id} className={`adm-lead${l.lido ? '' : ' is-new'}`}>
                <header>
                  <div>
                    <strong>{l.nome}</strong>
                    {!l.lido && <span className="adm-badge">Novo</span>}
                    <small>{dataHora.format(l.createdAt)}</small>
                  </div>
                  <div className="adm-actions">
                    <form action={marcarLido}>
                      <input type="hidden" name="id" value={l.id} />
                      <input type="hidden" name="lido" value={String(!l.lido)} />
                      <PendingButton className="adm-link adm-link--btn">{l.lido ? 'Marcar como novo' : 'Marcar como lido'}</PendingButton>
                    </form>
                    <form action={excluirLead}>
                      <input type="hidden" name="id" value={l.id} />
                      <ConfirmButton className="adm-link adm-link--btn adm-link--danger" message="Excluir este contato?">Excluir</ConfirmButton>
                    </form>
                  </div>
                </header>
                <p className="adm-lead__car">
                  Veículo:{' '}
                  {l.carSlug ? <Link href={`/carros/${l.carSlug}`} target="_blank">{l.carNome}</Link> : (l.carNome ?? '—')}
                </p>
                <p className="adm-lead__msg">{l.mensagem}</p>
                <div className="adm-lead__contact">
                  <a href={`mailto:${l.email}`}>{l.email}</a>
                  <a href={`tel:${tel}`}>{l.telefone}</a>
                  {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="adm-wa">Responder no WhatsApp</a>}
                  {l.aceitaOfertas && <span className="adm-muted">Aceita receber ofertas</span>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
