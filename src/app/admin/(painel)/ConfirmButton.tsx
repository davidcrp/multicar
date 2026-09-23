'use client';

import { useFormStatus } from 'react-dom';

/** Botão de envio que pede confirmação antes (ex.: excluir). */
export function ConfirmButton({ message, children, className }: { message: string; children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      className={className}
      disabled={pending}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {pending ? '…' : children}
    </button>
  );
}

export function PendingButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button className={className} disabled={pending}>
      {pending ? '…' : children}
    </button>
  );
}
