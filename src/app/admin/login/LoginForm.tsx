'use client';

import { useActionState } from 'react';
import { login, type LoginState } from '../actions';

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="adm-form adm-login__form">
      <label className="adm-field">
        <span>E-mail</span>
        <input type="email" name="email" required autoComplete="username" maxLength={160} />
      </label>
      <label className="adm-field">
        <span>Senha</span>
        <input type="password" name="senha" required autoComplete="current-password" maxLength={200} />
      </label>
      {state.error && (
        <p className="adm-error" role="alert">
          {state.error}
        </p>
      )}
      <button className="btn btn--red btn--block adm-btn-lg" disabled={pending}>
        {pending ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
