import { CLIENT_CAPABILITIES_META_KEY } from '@modelcontextprotocol/server';
import { describe, expect, it } from 'vitest';
import { prepararEstudo } from '../../src/formularios/estudo.js';
import { criarContextoMcp } from '../apoio/contexto-mcp.js';

describe('prepararEstudo', () => {
  it('libera o cadastro com dados completos e deixa observações omitidas nulas', async () => {
    // Arrange
    const dados = { partitura_id: 27, data: '2026-11-01', minutos: 25 };
    const contexto = criarContextoMcp();

    // Act
    const resultado = await prepararEstudo(dados, contexto);

    // Assert
    expect(resultado).toEqual({ dados: { ...dados, observacoes: null } });
  });

  it('solicita os campos ausentes pela conversa quando não há suporte a formulário', async () => {
    // Arrange
    const dados = { partitura_id: 27 };
    const contexto = criarContextoMcp();

    // Act
    const resultado = await prepararEstudo(dados, contexto);

    // Assert
    expect(resultado).toMatchObject({ resposta: {
      isError: true,
      content: [{ type: 'text', text: expect.stringContaining('pergunte ao usuário: data (AAAA-MM-DD) e minutos') }],
    } });
    expect(resultado).not.toHaveProperty('dados');
  });

  it('monta um formulário apenas para os campos que ainda faltam', async () => {
    // Arrange
    const dados = { partitura_id: 27, data: '2026-11-01', observacoes: null };
    const contexto = criarContextoMcp({
      envelope: { [CLIENT_CAPABILITIES_META_KEY]: { elicitation: { form: {} } } },
    });

    // Act
    const resultado = await prepararEstudo(dados, contexto);

    // Assert
    expect(resultado).toMatchObject({ resposta: {
      resultType: 'input_required',
      inputRequests: { estudo: {
        method: 'elicitation/create',
        params: { requestedSchema: {
          type: 'object',
          required: ['minutos'],
          properties: { minutos: { type: 'integer', minimum: 1 } },
        } },
      } },
    } });
    expect(resultado).not.toHaveProperty('dados');
  });

  it('completa os dados aceitos sem alterar campos já informados', async () => {
    // Arrange
    const dados = { partitura_id: 27, data: '2026-11-01', observacoes: 'Mãos separadas' };
    const contexto = criarContextoMcp({ inputResponses: { estudo: {
      action: 'accept', content: { minutos: 25, partitura_id: 99, data: '2026-12-01', observacoes: 'Outro texto' },
    } } });

    // Act
    const resultado = await prepararEstudo(dados, contexto);

    // Assert
    expect(resultado).toEqual({ dados: { ...dados, minutos: 25 } });
  });

  it.each(['decline', 'cancel'])('não libera o cadastro quando o usuário responde %s', async (action) => {
    // Arrange
    const dados = { partitura_id: 27 };
    const contexto = criarContextoMcp({ inputResponses: { estudo: { action } } });

    // Act
    const resultado = await prepararEstudo(dados, contexto);

    // Assert
    expect(resultado).toMatchObject({ resposta: {
      isError: true,
      content: [{ type: 'text', text: expect.stringContaining('Nenhum estudo foi salvo') }],
    } });
    expect(resultado).not.toHaveProperty('dados');
  });

  it.each([
    { data: '2026-11-01', minutos: 0 },
    { data: '2026-02-30', minutos: 25 },
    { data: '2026-11-01' },
  ])('não libera dados inválidos recebidos pelo formulário: %j', async (content) => {
    // Arrange
    const dados = { partitura_id: 27 };
    const contexto = criarContextoMcp({ inputResponses: { estudo: { action: 'accept', content } } });

    // Act
    const resultado = await prepararEstudo(dados, contexto);

    // Assert
    expect(resultado).toMatchObject({ resposta: { isError: true } });
    expect(resultado).not.toHaveProperty('dados');
  });
});
