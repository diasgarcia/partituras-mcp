import type { Compositor } from './compositor';

export interface Partitura {
  readonly id: number;
  readonly titulo: string;
  readonly compositor: Compositor;
  readonly instrumento: string | null;
  readonly dificuldade: string | null;
  readonly status: string | null;
  readonly caminhoPdf: string | null;
}
