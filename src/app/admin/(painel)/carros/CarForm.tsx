'use client';

import Image from 'next/image';
import Link from 'next/link';
import { upload } from '@vercel/blob/client';
import { useActionState, useRef, useState } from 'react';
import type { Car } from '@/db/schema';
import { CAMBIOS, CARROCERIAS, COMBUSTIVEIS, CORES, ITENS_COMUNS } from '@/lib/loja';
import { salvarCarro, type CarFormState } from '../../actions';

const MAX_MB = 8;

export function CarForm({ car }: { car?: Car }) {
  const [state, action, pending] = useActionState<CarFormState, FormData>(salvarCarro, {});
  const [fotos, setFotos] = useState<string[]>(car?.fotos ?? []);
  const [enviando, setEnviando] = useState<string[]>([]);
  const [uploadErro, setUploadErro] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const f = (k: string) => state.fields?.[k];
  const extras = (car?.itens ?? []).filter((i) => !(ITENS_COMUNS as readonly string[]).includes(i));

  async function enviarFotos(files: FileList | null) {
    if (!files?.length) return;
    setUploadErro('');
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setUploadErro(`"${file.name}" não é uma imagem.`);
        continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setUploadErro(`"${file.name}" passa de ${MAX_MB} MB.`);
        continue;
      }
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z]/g, '');
      const nome = file.name.replace(/\.[^.]+$/, '').normalize('NFD').replace(/[^\w-]+/g, '-').slice(0, 40) || 'foto';
      setEnviando((e) => [...e, file.name]);
      try {
        const blob = await upload(`carros/${nome}.${ext}`, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          contentType: file.type,
        });
        setFotos((fs) => [...fs, blob.url]);
      } catch (e) {
        setUploadErro(`Falha ao enviar "${file.name}": ${e instanceof Error ? e.message : 'erro'}`);
      } finally {
        setEnviando((e) => e.filter((n) => n !== file.name));
      }
    }
    if (fileRef.current) fileRef.current.value = '';
  }

  const mover = (i: number, d: -1 | 1) =>
    setFotos((fs) => {
      const j = i + d;
      if (j < 0 || j >= fs.length) return fs;
      const n = [...fs];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });

  return (
    <form action={action} className="adm-form adm-carform">
      {car && <input type="hidden" name="id" value={car.id} />}
      {fotos.map((u) => (
        <input key={u} type="hidden" name="fotos" value={u} />
      ))}

      {state.error && <p className="adm-error" role="alert">{state.error}</p>}

      <section className="adm-card">
        <h2>Fotos</h2>
        <p className="adm-muted">A primeira foto é a capa. Use as setas para reordenar. JPG, PNG ou WebP até {MAX_MB} MB.</p>
        <div className="adm-photos">
          {fotos.map((u, i) => (
            <div key={u} className="adm-photo">
              <Image src={u} alt={`Foto ${i + 1}`} width={240} height={160} />
              {i === 0 && <span className="adm-photo__cover">Capa</span>}
              <div className="adm-photo__bar">
                <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} aria-label="Mover para a esquerda">←</button>
                <button type="button" onClick={() => mover(i, 1)} disabled={i === fotos.length - 1} aria-label="Mover para a direita">→</button>
                <button type="button" className="danger" onClick={() => setFotos((fs) => fs.filter((x) => x !== u))} aria-label="Remover foto">✕</button>
              </div>
            </div>
          ))}
          {enviando.map((n) => (
            <div key={n} className="adm-photo adm-photo--loading">Enviando…</div>
          ))}
          <label className="adm-photo adm-photo--add">
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={(e) => enviarFotos(e.target.files)} />
            <span>+ Adicionar fotos</span>
          </label>
        </div>
        {uploadErro && <p className="adm-error">{uploadErro}</p>}
        {f('fotos') && <p className="adm-error">{f('fotos')}</p>}
      </section>

      <section className="adm-card">
        <h2>Dados principais</h2>
        <div className="adm-grid">
          <Field label="Marca*" error={f('marca')}><input name="marca" required maxLength={60} defaultValue={car?.marca} placeholder="Ex.: Honda" /></Field>
          <Field label="Modelo*" error={f('modelo')}><input name="modelo" required maxLength={60} defaultValue={car?.modelo} placeholder="Ex.: CR-V" /></Field>
          <Field label="Versão" error={f('versao')} wide><input name="versao" maxLength={160} defaultValue={car?.versao} placeholder="Ex.: 1.5 TURBO TOURING 4WD CVT" /></Field>
          <Field label="Preço (R$)*" error={f('preco')}><input name="preco" type="number" required min={1000} step={1} defaultValue={car?.preco} /></Field>
          <Field label="Tabela FIPE (R$)" error={f('fipe')}><input name="fipe" type="number" min={0} step={1} defaultValue={car?.fipe ?? ''} /></Field>
          <Field label="Média de mercado (R$)" error={f('media')}><input name="media" type="number" min={0} step={1} defaultValue={car?.media ?? ''} /></Field>
          <Field label="Ano fabricação*" error={f('anoFabricacao')}><input name="anoFabricacao" type="number" required min={1950} defaultValue={car?.anoFabricacao} /></Field>
          <Field label="Ano modelo*" error={f('anoModelo')}><input name="anoModelo" type="number" required min={1950} defaultValue={car?.anoModelo} /></Field>
          <Field label="KM*" error={f('km')}><input name="km" type="number" required min={0} step={1} defaultValue={car?.km} /></Field>
          <Field label="Cor*" error={f('cor')}>
            <select name="cor" defaultValue={car?.cor ?? 'branco'}>
              {CORES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="Câmbio*" error={f('cambio')}>
            <select name="cambio" defaultValue={car?.cambio ?? 'Automática'}>
              {CAMBIOS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Carroceria*" error={f('carroceria')}>
            <select name="carroceria" defaultValue={car?.carroceria ?? 'Hatch'}>
              {CARROCERIAS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Combustível*" error={f('combustivel')}>
            <select name="combustivel" defaultValue={car?.combustivel ?? 'Gasolina e álcool'}>
              {COMBUSTIVEIS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Final de placa" error={f('finalPlaca')}><input name="finalPlaca" type="number" min={0} max={9} defaultValue={car?.finalPlaca ?? ''} /></Field>
        </div>

        <div className="adm-checks">
          <Check name="aceitaTroca" label="Aceita troca" on={car?.aceitaTroca} />
          <Check name="unicoDono" label="Único dono" on={car?.unicoDono} />
          <Check name="ipvaPago" label="IPVA pago" on={car?.ipvaPago} />
          <Check name="licenciado" label="Licenciado" on={car?.licenciado} />
          <Check name="revisoes" label="Revisões em concessionária" on={car?.revisoes} />
        </div>
      </section>

      <section className="adm-card">
        <h2>Descrição</h2>
        <Field label="Texto que aparece no anúncio" error={f('descricao')} wide>
          <textarea name="descricao" rows={3} maxLength={2000} defaultValue={car?.descricao} />
        </Field>
      </section>

      <section className="adm-card">
        <h2>Itens do veículo</h2>
        <div className="adm-items">
          {ITENS_COMUNS.map((i) => (
            <label key={i} className="adm-check">
              <input type="checkbox" name="itemPadrao" value={i} defaultChecked={car?.itens.includes(i)} /> {i}
            </label>
          ))}
        </div>
        <Field label="Outros itens (um por linha)" error={f('itens')} wide>
          <textarea name="itensExtras" rows={3} defaultValue={extras.join('\n')} />
        </Field>
      </section>

      <div className="adm-savebar">
        <Check name="ativo" label="Publicado no site" on={car ? car.ativo : true} />
        <div className="adm-savebar__btns">
          <Link href="/admin" className="adm-link">Cancelar</Link>
          <button className="btn btn--red adm-btn-lg" disabled={pending || enviando.length > 0}>
            {pending ? 'Salvando…' : enviando.length > 0 ? 'Aguarde as fotos…' : 'Salvar veículo'}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, error, wide, children }: { label: string; error?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={`adm-field${wide ? ' adm-field--wide' : ''}${error ? ' has-error' : ''}`}>
      <span>{label}</span>
      {children}
      {error && <em>{error}</em>}
    </label>
  );
}

function Check({ name, label, on }: { name: string; label: string; on?: boolean }) {
  return (
    <label className="adm-check">
      <input type="checkbox" name={name} defaultChecked={on} /> {label}
    </label>
  );
}
