import type { Compositor } from '../../src/interfaces/compositor.js';
import type { Partitura } from '../../src/interfaces/partitura.js';
import type { SessaoEstudo } from '../../src/interfaces/sessao-estudo.js';

export const compositor: Compositor = {
  id: 13, nome: 'Compositor de teste', anoNascimento: 1980, anoFalecimento: null,
};

export const partitura: Partitura = {
  id: 27,
  titulo: 'Estudo de teste',
  instrumento: 'Piano',
  dificuldade: 'Iniciante',
  status: 'Em andamento',
  caminhoPdf: null,
  compositor,
};

export const sessao: SessaoEstudo = {
  id: 41,
  partitura,
  data: '2026-11-01',
  minutos: 25,
  observacoes: null,
};
