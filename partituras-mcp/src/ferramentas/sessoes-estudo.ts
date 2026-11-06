import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod';
import type { ClienteApi } from '../api/cliente-api.js';
import { esquemaSessaoEstudo } from '../esquemas/respostas.js';
import { esquemaCadastroEstudo, esquemaDadosEstudo, prepararEstudo } from '../formularios/estudo.js';
import { executarFerramenta } from './resultado.js';

const esquemaId = z.number().int().positive();
const camposEstudo = esquemaDadosEstudo.shape;

export function registrarFerramentasSessoesEstudo(servidor: McpServer, cliente: ClienteApi): void {
  // Create - registrar sessão de estudo
  servidor.registerTool('registrar_estudo', {
    description: 'Registra um estudo de uma partitura. Informe a data no formato AAAA-MM-DD. Se faltarem data ou minutos, solicita os dados em um formulário quando o cliente tiver suporte; nos demais clientes, peça os dados pela conversa e chame novamente. Não invente valores para preencher campos ausentes.',
    inputSchema: esquemaCadastroEstudo,
    outputSchema: z.object({ resultado: esquemaSessaoEstudo }),
  }, async (dados, contexto) => {
    const preparacao = await prepararEstudo(dados, contexto);
    if ('resposta' in preparacao) return preparacao.resposta;
    const { partitura_id, data, minutos, observacoes } = preparacao.dados;
    return executarFerramenta(() => cliente.requisicao('POST', '/sessoes-estudo', esquemaSessaoEstudo, {
      partitura: { id: partitura_id }, data, minutos, observacoes,
    }));
  });

  // Read - listar sessões de estudo
  servidor.registerTool('listar_sessoes_estudo', {
    description: 'Lista todas as sessões de estudo cadastradas.',
    inputSchema: z.object({}),
    outputSchema: z.object({ resultado: z.array(esquemaSessaoEstudo) }),
    annotations: { readOnlyHint: true },
  }, async () => executarFerramenta(
    () => cliente.requisicao('GET', '/sessoes-estudo', z.array(esquemaSessaoEstudo)),
  ));

  // Read - buscar sessão de estudo por ID
  servidor.registerTool('buscar_sessao_estudo', {
    description: 'Busca uma sessão de estudo pelo ID.',
    inputSchema: z.object({ sessao_id: esquemaId }),
    outputSchema: z.object({ resultado: esquemaSessaoEstudo }),
    annotations: { readOnlyHint: true },
  }, async ({ sessao_id }) => executarFerramenta(
    () => cliente.requisicao('GET', `/sessoes-estudo/${sessao_id}`, esquemaSessaoEstudo),
  ));

  // Read - buscar estudos por compositor (JOIN)
  servidor.registerTool('buscar_estudos_por_compositor', {
    description: 'Lista os estudos de um compositor usando a consulta com JOIN da API.',
    inputSchema: z.object({ compositor_id: esquemaId }),
    outputSchema: z.object({ resultado: z.array(esquemaSessaoEstudo) }),
    annotations: { readOnlyHint: true },
  }, async ({ compositor_id }) => executarFerramenta(
    () => cliente.requisicao('GET', `/sessoes-estudo/compositor/${compositor_id}`, z.array(esquemaSessaoEstudo)),
  ));

  // Read - somar minutos estudados por partitura (SUM)
  servidor.registerTool('total_minutos_por_partitura', {
    description: 'Soma os minutos estudados de uma partitura usando a consulta SUM da API.',
    inputSchema: z.object({ partitura_id: esquemaId }),
    outputSchema: z.object({ resultado: z.number().int() }),
    annotations: { readOnlyHint: true },
  }, async ({ partitura_id }) => executarFerramenta(
    () => cliente.requisicao('GET', `/sessoes-estudo/partitura/${partitura_id}/total-minutos`, z.number().int()),
  ));

  // Update - atualizar sessão de estudo
  servidor.registerTool('atualizar_estudo', {
    description: 'Substitui os dados de um estudo. A data deve estar no formato AAAA-MM-DD. Observações omitidas ficam nulas.',
    inputSchema: z.object({ sessao_id: esquemaId, ...camposEstudo }),
    outputSchema: z.object({ resultado: esquemaSessaoEstudo }),
  }, async ({ sessao_id, partitura_id, data, minutos, observacoes }) => executarFerramenta(
    () => cliente.requisicao('PUT', `/sessoes-estudo/${sessao_id}`, esquemaSessaoEstudo, {
      partitura: { id: partitura_id },
      data,
      minutos,
      observacoes,
    }),
  ));

  // Delete - excluir sessão de estudo
  servidor.registerTool('excluir_estudo', {
    description: 'Exclui uma sessão de estudo pelo ID.',
    inputSchema: z.object({ sessao_id: esquemaId }),
    outputSchema: z.object({ resultado: z.string() }),
    annotations: { destructiveHint: true },
  }, async ({ sessao_id }) => executarFerramenta(async () => {
    await cliente.requisicao('DELETE', `/sessoes-estudo/${sessao_id}`, z.void());
    return 'Sessão de estudo excluída.';
  }));
}
