import { describe, expect, it } from 'vitest';
import { carregarConfiguracao } from '../../src/configuracao.js';

describe('carregarConfiguracao', () => {
  it('usa os endereços padrão quando o ambiente não define opções', () => {
    // Arrange
    const ambiente = {};

    // Act
    const resultado = carregarConfiguracao(ambiente);

    // Assert
    expect(resultado).toEqual({ urlApi: 'http://localhost:8080', porta: 8000 });
  });

  it('lê as opções do ambiente e converte a porta para número', () => {
    // Arrange
    const ambiente = { PARTITURAS_API_URL: 'https://api.exemplo.com', PORT: '9000' };

    // Act
    const resultado = carregarConfiguracao(ambiente);

    // Assert
    expect(resultado).toEqual({ urlApi: 'https://api.exemplo.com', porta: 9000 });
  });

  it.each([
    { PORT: '0' },
    { PORT: '65536' },
    { PARTITURAS_API_URL: 'ftp://api.exemplo.com' },
  ])('rejeita opções inválidas: %j', (ambiente) => {
    // Arrange
    const opcoes = { ...ambiente };

    // Act
    const resultado = () => carregarConfiguracao(opcoes);

    // Assert
    expect(resultado).toThrow();
  });
});
