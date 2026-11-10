import { McpServer, type CallToolResult, type InputRequiredResult, type ServerContext } from '@modelcontextprotocol/server';
import { describe, expect, it, vi } from 'vitest';
import * as z from 'zod';
import { ClienteApi } from '../../src/api/cliente-api.js';
import type { DadosResultado } from '../../src/apresentacao/formatar-resultado.js';
import { registrarFerramentasCompositores } from '../../src/ferramentas/compositores.js';
import { registrarFerramentasPartituras } from '../../src/ferramentas/partituras.js';
import { registrarFerramentasSessoesEstudo } from '../../src/ferramentas/sessoes-estudo.js';
import { criarContextoMcp } from '../apoio/contexto-mcp.js';
import { compositor, partitura, sessao } from '../apoio/dados.js';

type AcaoFerramenta = (dados: Record<string, unknown>, contexto: ServerContext) =>
  CallToolResult | InputRequiredResult | Promise<CallToolResult | InputRequiredResult>;

function prepararFerramenta(nome: string) {
  const cliente = new ClienteApi('http://localhost:8080');
  const requisicao = vi.spyOn(cliente, 'requisicao')
    .mockRejectedValue(new Error('A API não deveria ser chamada neste teste.'));
  const servidor = new McpServer({ name: 'teste-unitario', version: '1.0.0' });
  const registrar = vi.spyOn(servidor, 'registerTool');
  registrarFerramentasCompositores(servidor, cliente);
  registrarFerramentasPartituras(servidor, cliente);
  registrarFerramentasSessoesEstudo(servidor, cliente);

  const indice = registrar.mock.calls.findIndex(([registrada]) => registrada === nome);
  const ferramenta = registrar.mock.results[indice]?.value;
  if (!ferramenta || !(ferramenta.inputSchema instanceof z.ZodObject)) {
    throw new Error(`Ferramenta não registrada com schema Zod: ${nome}`);
  }

  const esquema = ferramenta.inputSchema;
  // O SDK usa uma união de assinaturas; nossas ferramentas sempre recebem dados e contexto.
  const acao = ferramenta.handler as AcaoFerramenta;
  return {
    requisicao,
    executar: (dados: Record<string, unknown>, contexto = criarContextoMcp()) => acao(esquema.parse(dados), contexto),
  };
}

interface CasoFerramenta {
  nome: string;
  argumentos: Record<string, unknown>;
  metodo: 'GET' | 'POST' | 'PUT' | 'DELETE';
  caminho: string;
  dados?: unknown;
  resultado: DadosResultado;
}

const dadosPartitura = {
  titulo: partitura.titulo,
  compositor: { id: compositor.id },
  instrumento: null,
  dificuldade: null,
  status: null,
  caminhoPdf: null,
};
const dadosEstudo = {
  partitura: { id: partitura.id }, data: sessao.data, minutos: sessao.minutos, observacoes: null,
};

const casos: CasoFerramenta[] = [
  { nome: 'cadastrar_compositor', argumentos: { nome: compositor.nome, ano_nascimento: 1980 }, metodo: 'POST', caminho: '/compositores', dados: { nome: compositor.nome, anoNascimento: 1980, anoFalecimento: null }, resultado: compositor },
  { nome: 'listar_compositores', argumentos: {}, metodo: 'GET', caminho: '/compositores', resultado: [compositor] },
  { nome: 'buscar_compositor', argumentos: { compositor_id: 13 }, metodo: 'GET', caminho: '/compositores/13', resultado: compositor },
  { nome: 'atualizar_compositor', argumentos: { compositor_id: 13, nome: compositor.nome, ano_nascimento: 1980, ano_falecimento: null }, metodo: 'PUT', caminho: '/compositores/13', dados: { nome: compositor.nome, anoNascimento: 1980, anoFalecimento: null }, resultado: compositor },
  { nome: 'excluir_compositor', argumentos: { compositor_id: 13 }, metodo: 'DELETE', caminho: '/compositores/13', resultado: 'Compositor excluído.' },
  { nome: 'cadastrar_partitura', argumentos: { titulo: partitura.titulo, compositor_id: 13 }, metodo: 'POST', caminho: '/partituras', dados: dadosPartitura, resultado: partitura },
  { nome: 'listar_partituras', argumentos: {}, metodo: 'GET', caminho: '/partituras', resultado: [partitura] },
  { nome: 'buscar_partitura', argumentos: { partitura_id: 27 }, metodo: 'GET', caminho: '/partituras/27', resultado: partitura },
  { nome: 'atualizar_partitura', argumentos: { partitura_id: 27, titulo: partitura.titulo, compositor_id: 13 }, metodo: 'PUT', caminho: '/partituras/27', dados: dadosPartitura, resultado: partitura },
  { nome: 'excluir_partitura', argumentos: { partitura_id: 27 }, metodo: 'DELETE', caminho: '/partituras/27', resultado: 'Partitura excluída.' },
  { nome: 'registrar_estudo', argumentos: { partitura_id: 27, data: sessao.data, minutos: 25 }, metodo: 'POST', caminho: '/sessoes-estudo', dados: dadosEstudo, resultado: sessao },
  { nome: 'listar_sessoes_estudo', argumentos: {}, metodo: 'GET', caminho: '/sessoes-estudo', resultado: [sessao] },
  { nome: 'buscar_sessao_estudo', argumentos: { sessao_id: 41 }, metodo: 'GET', caminho: '/sessoes-estudo/41', resultado: sessao },
  { nome: 'buscar_estudos_por_compositor', argumentos: { compositor_id: 13 }, metodo: 'GET', caminho: '/sessoes-estudo/compositor/13', resultado: [sessao] },
  { nome: 'total_minutos_por_partitura', argumentos: { partitura_id: 27 }, metodo: 'GET', caminho: '/sessoes-estudo/partitura/27/total-minutos', resultado: 55 },
  { nome: 'atualizar_estudo', argumentos: { sessao_id: 41, partitura_id: 27, data: sessao.data, minutos: 25 }, metodo: 'PUT', caminho: '/sessoes-estudo/41', dados: dadosEstudo, resultado: sessao },
  { nome: 'excluir_estudo', argumentos: { sessao_id: 41 }, metodo: 'DELETE', caminho: '/sessoes-estudo/41', resultado: 'Sessão de estudo excluída.' },
];

describe('ferramentas MCP', () => {
  it.each(casos)('$nome encaminha os dados corretos ao cliente da API', async (caso) => {
    // Arrange
    const { requisicao, executar } = prepararFerramenta(caso.nome);
    requisicao.mockResolvedValue(caso.metodo === 'DELETE' ? undefined : caso.resultado);

    // Act
    const resultado = await executar(caso.argumentos);

    // Assert
    expect(requisicao).toHaveBeenCalledTimes(1);
    expect(requisicao.mock.calls[0]?.slice(0, 2)).toEqual([caso.metodo, caso.caminho]);
    expect(requisicao.mock.calls[0]?.[3]).toEqual(caso.dados);
    expect(resultado).toMatchObject({ structuredContent: { resultado: caso.resultado } });
    expect(resultado).not.toHaveProperty('isError', true);
  });

  it('preserva o nascimento omitido ao limpar o ano de falecimento', async () => {
    // Arrange
    const { requisicao, executar } = prepararFerramenta('atualizar_compositor');
    requisicao.mockResolvedValueOnce({ ...compositor, anoFalecimento: 2020 });
    requisicao.mockResolvedValueOnce(compositor);

    // Act
    await executar({ compositor_id: 13, nome: compositor.nome, ano_falecimento: null });

    // Assert
    expect(requisicao.mock.calls[0]?.slice(0, 2)).toEqual(['GET', '/compositores/13']);
    expect(requisicao.mock.calls[1]?.slice(0, 2)).toEqual(['PUT', '/compositores/13']);
    expect(requisicao.mock.calls[1]?.[3]).toEqual({
      nome: compositor.nome, anoNascimento: 1980, anoFalecimento: null,
    });
  });

  it('preserva o link de PDF informado e monta o relacionamento pelo ID do compositor', async () => {
    // Arrange
    const { requisicao, executar } = prepararFerramenta('cadastrar_partitura');
    const caminho = 'https://imslp.org/wiki/Obra_(Compositor)?download=1';
    requisicao.mockResolvedValue({ ...partitura, caminhoPdf: caminho });

    // Act
    await executar({ titulo: partitura.titulo, compositor_id: 13, instrumento: 'Piano', caminho_pdf: caminho });

    // Assert
    expect(requisicao.mock.calls[0]?.[3]).toEqual({
      ...dadosPartitura, instrumento: 'Piano', caminhoPdf: caminho,
    });
  });

  it.each(['excluir_compositor', 'excluir_partitura'])('%s não confirma sucesso quando a API bloqueia a exclusão', async (nome) => {
    // Arrange
    const { requisicao, executar } = prepararFerramenta(nome);
    requisicao.mockRejectedValue(new Error('A API retornou HTTP 409: conflito de vínculo'));
    const argumentos = nome === 'excluir_compositor' ? { compositor_id: 13 } : { partitura_id: 27 };

    // Act
    const resultado = await executar(argumentos);

    // Assert
    expect(resultado).toMatchObject({ isError: true });
    expect(resultado).not.toHaveProperty('structuredContent');
  });

  it('não chama a API para registrar estudo sem os dados obrigatórios', async () => {
    // Arrange
    const { requisicao, executar } = prepararFerramenta('registrar_estudo');

    // Act
    const resultado = await executar({ partitura_id: 27 });

    // Assert
    expect(requisicao).not.toHaveBeenCalled();
    expect(resultado).toMatchObject({ isError: true });
  });

  it('não chama a API quando o preenchimento do estudo é cancelado', async () => {
    // Arrange
    const { requisicao, executar } = prepararFerramenta('registrar_estudo');
    const contexto = criarContextoMcp({ inputResponses: { estudo: { action: 'cancel' } } });

    // Act
    const resultado = await executar({ partitura_id: 27 }, contexto);

    // Assert
    expect(requisicao).not.toHaveBeenCalled();
    expect(resultado).toMatchObject({ isError: true });
  });
});
