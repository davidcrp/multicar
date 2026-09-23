'use client';

import { useActionState } from 'react';
import { enviarLead, type LeadState } from '@/app/actions/lead';

export function LeadForm({ carId }: { carId: number }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(enviarLead, { status: 'idle' });
  const err = (f: string) => (state.status === 'error' ? state.fields?.[f] : undefined);
  const v = state.status === 'error' ? state.values ?? {} : {};

  if (state.status === 'ok') {
    return (
      <div className="lead__ok" role="status">
        <strong>Mensagem enviada!</strong>
        <p>Recebemos seu contato e vamos responder em breve. Quer agilizar? Fale agora pelo WhatsApp.</p>
        <a className="whats" href={state.whatsapp} target="_blank" rel="noopener noreferrer">
          Continuar no WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form className="lead" action={action} key={state.status === 'error' ? JSON.stringify(v) : 'novo'}>
      <input type="hidden" name="carId" value={carId} />
      {/* Campo armadilha contra robôs — escondido para pessoas */}
      <input type="text" name="site" tabIndex={-1} autoComplete="off" className="lead__hp" aria-hidden="true" />

      <input type="text" name="nome" placeholder="Nome*" required maxLength={100} autoComplete="name" defaultValue={v.nome} aria-invalid={!!err('nome')} />
      <input type="email" name="email" placeholder="E-mail*" required maxLength={160} autoComplete="email" defaultValue={v.email} aria-invalid={!!err('email')} />
      <input type="tel" name="telefone" placeholder="Telefone*" required maxLength={30} autoComplete="tel" defaultValue={v.telefone} aria-invalid={!!err('telefone')} />
      <label className="lead__msg">
        <span>Mensagem*</span>
        <textarea name="mensagem" rows={4} required maxLength={1000} aria-invalid={!!err('mensagem')} defaultValue={v.mensagem ?? 'Olá, tenho interesse no veículo. Por favor entre em contato.'} />
      </label>
      <label className="lead__check">
        <input type="checkbox" name="ofertas" /> Quero receber ofertas da MultiCar
      </label>

      {state.status === 'error' && (
        <p className="lead__error" role="alert">
          {state.message}
          {state.fields && (
            <>
              <br />
              {Object.values(state.fields).join(' · ')}
            </>
          )}
        </p>
      )}

      <button className="btn btn--red btn--block btn--tall" type="submit" disabled={pending}>
        {pending ? 'Enviando…' : 'Enviar mensagem'}
      </button>
    </form>
  );
}
