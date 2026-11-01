import type { Compositor } from './compositor.js';

export interface Partitura {
  id: number;
  titulo: string;
  instrumento: string | null;
  dificuldade: string | null;
  status: string | null;
  caminhoPdf: string | null;
  compositor: Compositor;
}
