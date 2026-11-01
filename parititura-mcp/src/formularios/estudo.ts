import { CLIENT_CAPABILITIES_META_KEY, inputRequired, type CallToolResult, type InputRequiredResult, type ServerContext } from '@modelcontextprotocol/server';
import * as z from 'zod';

const esquemaObservacoes = z.string().max(1000).nullable();
const esquemaCapacidadeFormulario = z.object({
  [CLIENT_CAPABILITIES_META_KEY]: z.object({
    elicitation: z.object({ form: z.object({}) }),
  }),
});
export const esquemaDadosEstudo = z.object({
  partitura_id: z.number().int().positive().describe('ID de uma partitura existente.'),
  data: z.iso.date().describe('Data do estudo no formato AAAA-MM-DD.'),
  minutos: z.number().int().min(1),
  observacoes: esquemaObservacoes.default(null),
});

export const esquemaCadastroEstudo = esquemaDadosEstudo
  .partial({ data: true, minutos: true })
  .extend({ observacoes: esquemaObservacoes.optional() });

type DadosEstudo = z.output<typeof esquemaDadosEstudo>;
type DadosCadastro = z.output<typeof esquemaCadastroEstudo>;
type PreparacaoEstudo = { dados: DadosEstudo } | { resposta: CallToolResult | InputRequiredResult };

function pendente(mensagem: string): PreparacaoEstudo {
  return { resposta: { isError: true, content: [{ type: 'text', text: mensagem }] } };
}

export async function prepararEstudo(
  dados: DadosCadastro,
  contexto: ServerContext,
): Promise<PreparacaoEstudo> {
  const completos = esquemaDadosEstudo.safeParse(dados);
  if (completos.success) return { dados: completos.data };

  const camposFaltantes = [dados.data === undefined ? 'data (AAAA-MM-DD)' : '',
    dados.minutos === undefined ? 'minutos de estudo' : ''].filter(Boolean);
  const formulario = z.object({
    ...(dados.data === undefined ? { data: esquemaDadosEstudo.shape.data } : {}),
    ...(dados.minutos === undefined ? { minutos: esquemaDadosEstudo.shape.minutos } : {}),
    ...(dados.observacoes === undefined ? { observacoes: z.string().max(1000).optional() } : {}),
  });

  const resposta = contexto.mcpReq.inputResponses?.estudo;
  if (resposta !== undefined) {
    const preenchimento = z.object({
      action: z.enum(['accept', 'decline', 'cancel']),
      content: formulario.optional(),
    }).safeParse(resposta);

    if (!preenchimento.success) return pendente(':[ Os dados do formulário são inválidos. Nenhum estudo foi salvo.');
    if (preenchimento.data.action !== 'accept') {
      return pendente('O preenchimento foi cancelado ou recusado. Nenhum estudo foi salvo; aguarde o usuário pedir para continuar.');
    }

    const validacao = esquemaDadosEstudo.safeParse({ ...dados, ...preenchimento.data.content });
    if (!validacao.success) return pendente(':[ Complete os dados obrigatórios do estudo. Nenhum estudo foi salvo.');
    return { dados: validacao.data };
  }

  if (!esquemaCapacidadeFormulario.safeParse(contexto.mcpReq.envelope).success) {
    return pendente(`Para registrar o estudo, pergunte ao usuário: ${camposFaltantes.join(' e ')}. `
      + 'Depois chame registrar_estudo novamente com os dados completos. Nenhum estudo foi salvo.');
  }

  return {
    resposta: inputRequired({
      inputRequests: {
        estudo: inputRequired.elicit({
          message: `Complete os dados do estudo da partitura de ID ${dados.partitura_id}.`,
          requestedSchema: formulario,
        }),
      },
    }),
  };
}
