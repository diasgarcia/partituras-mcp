import type { Partitura } from './partitura';

export interface SessaoEstudo {
  readonly id: number;
  readonly partitura: Partitura;
  readonly data: string;
  readonly minutos: number;
  readonly observacoes: string | null;
}
