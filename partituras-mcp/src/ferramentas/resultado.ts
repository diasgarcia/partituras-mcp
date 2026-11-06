import type { CallToolResult } from '@modelcontextprotocol/server';
import { formatarErro, formatarResultado, type DadosResultado } from '../apresentacao/formatar-resultado.js';

export async function executarFerramenta<T extends DadosResultado>(acao: () => Promise<T>): Promise<CallToolResult> {
  try {
    const resultado = await acao();

    return {
      content: [{
        type: 'text',
        text: formatarResultado(resultado),
      }],
      structuredContent: { resultado },
    };
  } catch (erro) {
    return {
      isError: true,
      content: [{
        type: 'text',
        text: formatarErro(erro),
      }],
    };
  }
}
