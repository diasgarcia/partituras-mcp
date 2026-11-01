import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod';
import type { ClienteApi } from '../api/cliente-api.js';
import { esquemaCompositor } from '../esquemas/respostas.js';
import { executarFerramenta } from './resultado.js';

const esquemaId = z.number().int().positive().describe('ID do compositor cadastrado.');
const esquemaNome = z.string().min(1).max(255).refine((nome) => nome.trim().length > 0, {
  message: 'Informe o nome do compositor.',
});

export function registrarFerramentasCompositores(servidor: McpServer, cliente: ClienteApi): void {
  // Create
  servidor.registerTool('cadastrar_compositor', {
    description: 'Cadastra um compositor e retorna o registro com o ID gerado.',
    inputSchema: z.object({ nome: esquemaNome }),
    outputSchema: z.object({ resultado: esquemaCompositor }),
  }, async ({ nome }) => executarFerramenta(
    () => cliente.requisicao('POST', '/compositores', esquemaCompositor, { nome }),
  ));

  // Read - listar compositores
  servidor.registerTool('listar_compositores', {
    description: 'Lista todos os compositores cadastrados.',
    inputSchema: z.object({}),
    outputSchema: z.object({ resultado: z.array(esquemaCompositor) }),
    annotations: { readOnlyHint: true },
  }, async () => executarFerramenta(
    () => cliente.requisicao('GET', '/compositores', z.array(esquemaCompositor)),
  ));

  // Read - buscar compositor por ID
  servidor.registerTool('buscar_compositor', {
    description: 'Busca um compositor pelo ID.',
    inputSchema: z.object({ compositor_id: esquemaId }),
    outputSchema: z.object({ resultado: esquemaCompositor }),
    annotations: { readOnlyHint: true },
  }, async ({ compositor_id }) => executarFerramenta(
    () => cliente.requisicao('GET', `/compositores/${compositor_id}`, esquemaCompositor),
  ));

  // Update
  servidor.registerTool('atualizar_compositor', {
    description: 'Atualiza o nome de um compositor existente.',
    inputSchema: z.object({ compositor_id: esquemaId, nome: esquemaNome }),
    outputSchema: z.object({ resultado: esquemaCompositor }),
  }, async ({ compositor_id, nome }) => executarFerramenta(
    () => cliente.requisicao('PUT', `/compositores/${compositor_id}`, esquemaCompositor, { nome }),
  ));

  // Delete
  servidor.registerTool('excluir_compositor', {
    description: 'Exclui um compositor. A API bloqueia a exclusão se ele tiver partituras.',
    inputSchema: z.object({ compositor_id: esquemaId }),
    outputSchema: z.object({ resultado: z.string() }),
    annotations: { destructiveHint: true },
  }, async ({ compositor_id }) => executarFerramenta(async () => {
    await cliente.requisicao('DELETE', `/compositores/${compositor_id}`, z.void());
    return 'Compositor excluído.';
  }));
}
