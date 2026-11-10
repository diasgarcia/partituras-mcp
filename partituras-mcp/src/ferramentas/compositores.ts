import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod';
import type { ClienteApi } from '../api/cliente-api.js';
import { esquemaCompositor } from '../esquemas/respostas.js';
import { executarFerramenta } from './resultado.js';

const esquemaId = z.number().int().positive().describe('ID do compositor cadastrado.');
const esquemaNome = z.string().min(1).max(255).refine((nome) => nome.trim().length > 0, {
  message: 'Informe o nome do compositor.',
});
const esquemaAno = z.number().int().positive().nullable().optional();
const esquemaAnos = {
  ano_nascimento: esquemaAno.describe('Ano de nascimento, quando conhecido.'),
  ano_falecimento: esquemaAno.describe('Ano de falecimento. Use null se estiver vivo ou o ano for desconhecido.'),
};

export function registrarFerramentasCompositores(servidor: McpServer, cliente: ClienteApi): void {
  // Create
  servidor.registerTool('cadastrar_compositor', {
    description: 'Cadastra um compositor e retorna o registro com o ID gerado.',
    inputSchema: z.object({ nome: esquemaNome, ...esquemaAnos }),
    outputSchema: z.object({ resultado: esquemaCompositor }),
  }, async ({ nome, ano_nascimento, ano_falecimento }) => executarFerramenta(
    () => cliente.requisicao('POST', '/compositores', esquemaCompositor, {
      nome, anoNascimento: ano_nascimento ?? null, anoFalecimento: ano_falecimento ?? null,
    }),
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
    description: 'Atualiza um compositor existente. Preserve os anos omitidos e use null para limpar um ano.',
    inputSchema: z.object({ compositor_id: esquemaId, nome: esquemaNome, ...esquemaAnos }),
    outputSchema: z.object({ resultado: esquemaCompositor }),
  }, async ({ compositor_id, nome, ano_nascimento, ano_falecimento }) => executarFerramenta(async () => {
    const caminho = `/compositores/${compositor_id}`;
    const atual = ano_nascimento === undefined || ano_falecimento === undefined
      ? await cliente.requisicao('GET', caminho, esquemaCompositor)
      : undefined;

    return cliente.requisicao('PUT', caminho, esquemaCompositor, {
      nome,
      anoNascimento: ano_nascimento === undefined ? atual?.anoNascimento : ano_nascimento,
      anoFalecimento: ano_falecimento === undefined ? atual?.anoFalecimento : ano_falecimento,
    });
  }));

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
