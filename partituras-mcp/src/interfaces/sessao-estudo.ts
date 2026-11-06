import type { Partitura } from './partitura.js';

export interface SessaoEstudo {
  id: number;
  partitura: Partitura;
  data: string;
  minutos: number;
  observacoes: string | null;
}
