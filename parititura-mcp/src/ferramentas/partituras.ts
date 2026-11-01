import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod';
import type { ClienteApi } from '../api/cliente-api.js';
import { esquemaPartitura } from '../esquemas/respostas.js';
import { executarFerramenta } from './resultado.js';

const esquemaId = z.number().int().positive();
const camposPartitura = {
  titulo: z.string().min(1).max(255).refine((titulo) => titulo.trim().length > 0, {
    message: 'Informe o título da partitura.',
  }),
  compositor_id: esquemaId.describe('ID de um compositor existente.'),
  instrumento: z.string().nullable().default(null),
  dificuldade: z.string().nullable().default(null),
  status: z.string().nullable().default(null),
  caminho_pdf: z.string().nullable().default(null).describe('Link do PDF ou do download; null se não houver.'),
};

const orientacaoPdf = `Para preencher caminho_pdf, identifique a obra pelo título e compositor:
- Se a obra não puder ser identificada com segurança, use null.
- Se a obra foi identificada e o usuário enviou um link, salve esse link exatamente como foi informado.
- Se a obra foi identificada e o usuário não enviou um link, use a pesquisa e navegação disponíveis no cliente para encontrar um PDF ou link de download em um repositório de partituras públicas, preferencialmente o IMSLP. Confira se o link corresponde à obra e ao compositor antes de salvá-lo.
- Se o usuário pedir para deixar sem PDF, respeite o pedido e use null.
- Se não houver pesquisa disponível ou um link confirmado, use null e informe que não foi possível obter o PDF. Nunca invente um endereço.`;

export function registrarFerramentasPartituras(servidor: McpServer, cliente: ClienteApi): void {
  // Create
  servidor.registerTool('cadastrar_partitura', {
    description: `Cadastra uma partitura vinculada a um compositor existente.\n\n${orientacaoPdf}`,
    inputSchema: z.object(camposPartitura),
    outputSchema: z.object({ resultado: esquemaPartitura }),
  }, async ({ titulo, compositor_id, instrumento, dificuldade, status, caminho_pdf }) => executarFerramenta(
    () => cliente.requisicao('POST', '/partituras', esquemaPartitura, {
      titulo,
      compositor: { id: compositor_id },
      instrumento,
      dificuldade,
      status,
      caminhoPdf: caminho_pdf,
    }),
  ));

  // Read - listar partituras
  servidor.registerTool('listar_partituras', {
    description: 'Lista todas as partituras com seus compositores.',
    inputSchema: z.object({}),
    outputSchema: z.object({ resultado: z.array(esquemaPartitura) }),
    annotations: { readOnlyHint: true },
  }, async () => executarFerramenta(
    () => cliente.requisicao('GET', '/partituras', z.array(esquemaPartitura)),
  ));

  // Read - buscar partitura por ID
  servidor.registerTool('buscar_partitura', {
    description: 'Busca uma partitura pelo ID.',
    inputSchema: z.object({ partitura_id: esquemaId }),
    outputSchema: z.object({ resultado: esquemaPartitura }),
    annotations: { readOnlyHint: true },
  }, async ({ partitura_id }) => executarFerramenta(
    () => cliente.requisicao('GET', `/partituras/${partitura_id}`, esquemaPartitura),
  ));

  // Update
  servidor.registerTool('atualizar_partitura', {
    description: `Substitui os dados da partitura. Campos opcionais omitidos ficam nulos.\n\n${orientacaoPdf}`,
    inputSchema: z.object({ partitura_id: esquemaId, ...camposPartitura }),
    outputSchema: z.object({ resultado: esquemaPartitura }),
  }, async ({ partitura_id, titulo, compositor_id, instrumento, dificuldade, status, caminho_pdf }) => executarFerramenta(
    () => cliente.requisicao('PUT', `/partituras/${partitura_id}`, esquemaPartitura, {
      titulo,
      compositor: { id: compositor_id },
      instrumento,
      dificuldade,
      status,
      caminhoPdf: caminho_pdf,
    }),
  ));

  // Delete
  servidor.registerTool('excluir_partitura', {
    description: 'Exclui uma partitura. A API bloqueia a exclusão se ela tiver estudos.',
    inputSchema: z.object({ partitura_id: esquemaId }),
    outputSchema: z.object({ resultado: z.string() }),
    annotations: { destructiveHint: true },
  }, async ({ partitura_id }) => executarFerramenta(async () => {
    await cliente.requisicao('DELETE', `/partituras/${partitura_id}`, z.void());
    return 'Partitura excluída.';
  }));
}
