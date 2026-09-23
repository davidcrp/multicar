import type { Car } from '@/db/schema';
import { CORES } from './loja';

export const brl = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export const brlCentavos = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const fmtKm = (n: number) => n.toLocaleString('pt-BR');

export const nomeCarro = (c: Pick<Car, 'marca' | 'modelo' | 'anoModelo'>) =>
  `${c.marca} ${c.modelo} ${c.anoModelo}`;

export const anoTexto = (c: Pick<Car, 'anoFabricacao' | 'anoModelo'>) =>
  `${c.anoFabricacao}/${c.anoModelo}`;

export const corLabel = (value: string) => CORES.find((c) => c.value === value)?.label ?? value;

export function slugify(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}
