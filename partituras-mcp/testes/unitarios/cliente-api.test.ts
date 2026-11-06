import { describe, expect, it, vi } from 'vitest';
import * as z from 'zod';
import { ClienteApi } from '../../src/api/cliente-api.js';
import { esquemaCompositor } from '../../src/esquemas/respostas.js';
import { compositor } from '../apoio/dados.js';

describe('ClienteApi', () => {
  it('envia o cadastro como JSON e remove barras finais da URL base', async () => {
    // Arrange
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(Response.json(compositor, { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    const cliente = new ClienteApi('http://localhost:8080///');
    const dados = { nome: compositor.nome };

    // Act
    const resultado = await cliente.requisicao('POST', '/compositores', esquemaCompositor, dados);

    // Assert
    expect(resultado).toEqual(compositor);
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('http://localhost:8080/compositores', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
      signal: expect.any(AbortSignal),
    });
  });

  it('envia uma consulta sem corpo ou cabeçalho de conteúdo JSON', async () => {
    // Arrange
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(Response.json([compositor]));
    vi.stubGlobal('fetch', fetchMock);
    const cliente = new ClienteApi('http://localhost:8080');

    // Act
    const resultado = await cliente.requisicao('GET', '/compositores', z.array(esquemaCompositor));

    // Assert
    expect(resultado).toEqual([compositor]);
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/compositores', expect.objectContaining({
      method: 'GET', headers: { Accept: 'application/json' }, body: undefined,
    }));
  });

  it('aceita a resposta vazia de uma exclusão com HTTP 204', async () => {
    // Arrange
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);
    const cliente = new ClienteApi('http://localhost:8080');

    // Act
    const resultado = await cliente.requisicao('DELETE', '/compositores/13', z.void());

    // Assert
    expect(resultado).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/compositores/13', expect.objectContaining({ method: 'DELETE' }));
  });

  it.each([400, 404, 409, 500])('preserva o status HTTP %i e o corpo do erro da API', async (status) => {
    // Arrange
    const corpo = JSON.stringify({ status, error: 'Erro da API' });
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(corpo, { status })));
    const cliente = new ClienteApi('http://localhost:8080');

    // Act
    const resultado = cliente.requisicao('DELETE', '/compositores/13', z.void());

    // Assert
    await expect(resultado).rejects.toThrow(`A API retornou HTTP ${status}: ${corpo}`);
  });

  it.each([
    ['JSON inválido', '<html>Erro</html>'],
    ['tipo incorreto no ID', JSON.stringify({ id: '13', nome: compositor.nome })],
  ])('rejeita uma resposta com %s', async (_descricao, corpo) => {
    // Arrange
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(corpo)));
    const cliente = new ClienteApi('http://localhost:8080');

    // Act
    const resultado = cliente.requisicao('GET', '/compositores/13', esquemaCompositor);

    // Assert
    await expect(resultado).rejects.toThrow('A API retornou uma resposta em formato inesperado.');
  });

  it('informa a indisponibilidade do Spring e preserva a causa da falha', async () => {
    // Arrange
    const erro = new TypeError('fetch failed');
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockRejectedValue(erro));
    const cliente = new ClienteApi('http://localhost:8080');

    // Act
    const resultado = cliente.requisicao('GET', '/compositores', z.array(esquemaCompositor));

    // Assert
    await expect(resultado).rejects.toMatchObject({
      message: 'Não foi possível acessar a API em http://localhost:8080. Verifique se o Spring está rodando.',
      cause: erro,
    });
  });
});
