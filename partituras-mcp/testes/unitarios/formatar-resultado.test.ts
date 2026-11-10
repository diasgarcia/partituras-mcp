import { describe, expect, it } from 'vitest';
import { formatarErro, formatarResultado } from '../../src/apresentacao/formatar-resultado.js';
import { compositor, partitura, sessao } from '../apoio/dados.js';

describe('formatarResultado', () => {
  it('monta a ficha da partitura com o compositor e o link de PDF', () => {
    // Arrange
    const registro = { ...partitura, caminhoPdf: 'https://imslp.org/wiki/Obra_(Compositor)' };

    // Act
    const resultado = formatarResultado(registro);

    // Assert
    expect(resultado).toContain('> **Estudo de teste** · ID **27**');
    expect(resultado).toContain('**Compositor:** Compositor de teste · ID 13');
    expect(resultado).toContain('[Abrir partitura](https://imslp.org/wiki/Obra_%28Compositor%29)');
  });

  it('indica a ausência de PDF em vez de inventar um link', () => {
    // Arrange
    const registro = { ...partitura, caminhoPdf: null };

    // Act
    const resultado = formatarResultado(registro);

    // Assert
    expect(resultado).toContain('**PDF:** Sem PDF cadastrado');
    expect(resultado).not.toContain('[Abrir partitura]');
  });

  it('mantém texto não HTTP como texto, sem criar link executável', () => {
    // Arrange
    const registro = { ...partitura, caminhoPdf: 'javascript:alert(1)' };

    // Act
    const resultado = formatarResultado(registro);

    // Assert
    expect(resultado).toContain('javascript:alert(1)');
    expect(resultado).not.toContain('[Abrir partitura]');
  });

  it('escapa caracteres Markdown e remove quebras de linha dentro da célula', () => {
    // Arrange
    const registros = [{ ...compositor, nome: 'Bach | [teste]\n**Piano**' }];

    // Act
    const resultado = formatarResultado(registros);

    // Assert
    expect(resultado.split('\n').at(-1)).toBe('| 13 | Bach \\| \\[teste\\] \\*\\*Piano\\*\\* | 1980 | — |');
  });

  it('apresenta datas brasileiras e soma somente as sessões recebidas', () => {
    // Arrange
    const registros = [sessao, { ...sessao, id: 42, data: '2026-11-02', minutos: 30 }];

    // Act
    const resultado = formatarResultado(registros);

    // Assert
    expect(resultado).toContain('| 41 | Estudo de teste | 01/11/2026 | 25 |');
    expect(resultado).toContain('| 42 | Estudo de teste | 02/11/2026 | 30 |');
    expect(resultado).toContain('**Total desta listagem:** 55 minutos');
  });

  it('informa uma consulta vazia de forma breve', () => {
    // Arrange
    const registros: typeof compositor[] = [];

    // Act
    const resultado = formatarResultado(registros);

    // Assert
    expect(resultado).toBe('Nenhum registro encontrado.');
  });

  it('acompanha o total numérico com a unidade minutos', () => {
    // Arrange
    const minutos = 55;

    // Act
    const resultado = formatarResultado(minutos);

    // Assert
    expect(resultado).toBe('**Total estudado:** 55 minutos');
  });
});

describe('formatarErro', () => {
  it('explica o conflito preservando o status HTTP sem expor o payload', () => {
    // Arrange
    const erro = new Error('A API retornou HTTP 409: {"timestamp":"2026-11-01","error":"Conflict"}');

    // Act
    const resultado = formatarErro(erro);

    // Assert
    expect(resultado).toContain('Os vínculos com outros registros impedem esta operação. (HTTP 409)');
    expect(resultado).not.toContain('timestamp');
  });

  it('preserva a mensagem útil de um erro de conexão', () => {
    // Arrange
    const erro = new Error('Verifique se o Spring está rodando.');

    // Act
    const resultado = formatarErro(erro);

    // Assert
    expect(resultado).toContain('Verifique se o Spring está rodando.');
  });
});
