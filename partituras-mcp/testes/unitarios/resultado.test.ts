import { describe, expect, it, vi } from 'vitest';
import { executarFerramenta } from '../../src/ferramentas/resultado.js';
import { compositor } from '../apoio/dados.js';

describe('executarFerramenta', () => {
  it('devolve uma ficha e preserva os dados estruturados após o sucesso', async () => {
    // Arrange
    const acao = vi.fn<() => Promise<typeof compositor>>().mockResolvedValue(compositor);

    // Act
    const resultado = await executarFerramenta(acao);

    // Assert
    expect(acao).toHaveBeenCalledOnce();
    expect(resultado.isError).not.toBe(true);
    expect(resultado.structuredContent).toEqual({ resultado: compositor });
    expect(resultado.content).toEqual([{ type: 'text', text: expect.stringContaining('Compositor de teste') }]);
  });

  it('marca a ferramenta como erro e não devolve dados de sucesso quando a ação falha', async () => {
    // Arrange
    const acao = vi.fn<() => Promise<typeof compositor>>().mockRejectedValue(new Error('A API retornou HTTP 409: conflito'));

    // Act
    const resultado = await executarFerramenta(acao);

    // Assert
    expect(resultado.isError).toBe(true);
    expect(resultado.structuredContent).toBeUndefined();
    expect(resultado.content).toEqual([{ type: 'text', text: expect.stringContaining('HTTP 409') }]);
  });
});
