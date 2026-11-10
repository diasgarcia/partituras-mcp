import * as z from 'zod';
import type { Compositor } from '../interfaces/compositor.js';
import type { Partitura } from '../interfaces/partitura.js';
import type { SessaoEstudo } from '../interfaces/sessao-estudo.js';

export const esquemaCompositor: z.ZodType<Compositor> = z.object({
  id: z.number().int(),
  nome: z.string(),
  anoNascimento: z.number().int().nullable(),
  anoFalecimento: z.number().int().nullable(),
});

export const esquemaPartitura: z.ZodType<Partitura> = z.object({
  id: z.number().int(),
  titulo: z.string(),
  instrumento: z.string().nullable(),
  dificuldade: z.string().nullable(),
  status: z.string().nullable(),
  caminhoPdf: z.string().nullable(),
  compositor: esquemaCompositor,
});

export const esquemaSessaoEstudo: z.ZodType<SessaoEstudo> = z.object({
  id: z.number().int(),
  partitura: esquemaPartitura,
  data: z.iso.date(),
  minutos: z.number().int(),
  observacoes: z.string().nullable(),
});
