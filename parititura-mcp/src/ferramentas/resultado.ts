import type { CallToolResult } from '@modelcontextprotocol/server';

export async function executarFerramenta<T>(acao: () => Promise<T>): Promise<CallToolResult> {
  try {
    const resultado = await acao();

    return {
      content: [{
        type: 'text',
        text: typeof resultado === 'string' ? resultado : JSON.stringify(resultado),
      }],
      structuredContent: { resultado },
    };
  } catch (erro) {
    return {
      isError: true,
      content: [{
        type: 'text',
        text: erro instanceof Error ? erro.message : 'Não foi possível executar a ferramenta.',
      }],
    };
  }
}
