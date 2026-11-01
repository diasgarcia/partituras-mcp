import * as z from 'zod';

type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class ClienteApi {
  constructor(private readonly urlApi: string) {}

  async requisicao<T>(
    metodo: MetodoHttp,
    caminho: string,
    esquemaResposta: z.ZodType<T>,
    dados?: unknown,
  ): Promise<T> {
    let resposta: Response;
    let conteudo: string;

    try {
      resposta = await fetch(`${this.urlApi.replace(/\/+$/, '')}${caminho}`, {
        method: metodo,
        headers: {
          Accept: 'application/json',
          ...(dados === undefined ? {} : { 'Content-Type': 'application/json' }),
        },
        body: dados === undefined ? undefined : JSON.stringify(dados),
        signal: AbortSignal.timeout(10_000),
      });
      conteudo = await resposta.text();
    } catch (erro) {
      throw new Error(
        `Não foi possível acessar a API em ${this.urlApi}. Verifique se o Spring está rodando.`,
        { cause: erro },
      );
    }

    if (!resposta.ok) {
      throw new Error(`A API retornou HTTP ${resposta.status}: ${conteudo}`);
    }

    let dadosResposta: unknown;

    try {
      dadosResposta = resposta.status === 204 ? undefined : JSON.parse(conteudo);
    } catch (erro) {
      throw new Error('A API retornou uma resposta em formato inesperado.', { cause: erro });
    }

    const validacao = esquemaResposta.safeParse(dadosResposta);

    if (!validacao.success) {
      throw new Error('A API retornou uma resposta em formato inesperado.', {
        cause: validacao.error,
      });
    }

    return validacao.data;
  }
}
