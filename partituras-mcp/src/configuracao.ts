import * as z from 'zod';

const esquemaConfiguracao = z.object({
  urlApi: z.url().regex(/^https?:\/\//, 'Use uma URL HTTP ou HTTPS para a API.'),
  porta: z.coerce.number().int().min(1).max(65535),
});

export function carregarConfiguracao(ambiente: NodeJS.ProcessEnv = process.env) {
  return esquemaConfiguracao.parse({
    urlApi: ambiente.PARTITURAS_API_URL ?? 'http://localhost:8080',
    porta: ambiente.PORT ?? '8000',
  });
}
