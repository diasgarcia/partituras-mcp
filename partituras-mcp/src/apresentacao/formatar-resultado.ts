import type { Compositor } from '../interfaces/compositor.js';
import type { Partitura } from '../interfaces/partitura.js';
import type { SessaoEstudo } from '../interfaces/sessao-estudo.js';

type Registro = Compositor | Partitura | SessaoEstudo;
export type DadosResultado = Registro | Registro[] | number | string;

function texto(valor: string | null): string {
  if (!valor?.trim()) return 'Não informado';
  return valor.replace(/\r?\n/g, ' ').replace(/[\\`*_{}[\]<>|]/g, '\\$&');
}

function dataFormatada(data: string): string {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function linkPdf(caminho: string | null): string {
  if (!caminho) return 'Sem PDF cadastrado';
  try {
    const url = new URL(caminho);
    if (!['http:', 'https:'].includes(url.protocol)) return texto(caminho);
    const endereco = url.href.replace(/[()|<>]/g, (caractere) => `%${caractere.charCodeAt(0).toString(16).toUpperCase()}`);
    return `[Abrir partitura](${endereco})`;
  } catch {
    return texto(caminho);
  }
}

function ficha(registro: Registro): string {
  if ('partitura' in registro) {
    return [
      `> **Sessão de estudo** · ID **${registro.id}**`,
      '>',
      `> **Partitura:** ${texto(registro.partitura.titulo)} · ID ${registro.partitura.id}`,
      `> **Data:** ${dataFormatada(registro.data)}`,
      `> **Duração:** ${registro.minutos} minutos`,
      `> **Observações:** ${texto(registro.observacoes)}`,
    ].join('\n');
  }
  if ('compositor' in registro) {
    return [
      `> **${texto(registro.titulo)}** · ID **${registro.id}**`,
      '>',
      `> **Compositor:** ${texto(registro.compositor.nome)} · ID ${registro.compositor.id}`,
      `> **Instrumento:** ${texto(registro.instrumento)}`,
      `> **Dificuldade:** ${texto(registro.dificuldade)}`,
      `> **Status:** ${texto(registro.status)}`,
      `> **PDF:** ${linkPdf(registro.caminhoPdf)}`,
    ].join('\n');
  }
  return `> **${texto(registro.nome)}**\n>\n> **ID do compositor:** ${registro.id}`;
}

function tabela(cabecalho: string[], linhas: string[][]): string {
  return [cabecalho, cabecalho.map(() => '---'), ...linhas]
    .map((linha) => `| ${linha.join(' | ')} |`)
    .join('\n');
}

export function formatarResultado(resultado: DadosResultado): string {
  if (typeof resultado === 'string') return `:] ${texto(resultado)}`;
  if (typeof resultado === 'number') return `**Total estudado:** ${resultado} minutos`;
  if (!Array.isArray(resultado)) return ficha(resultado);
  if (resultado.length === 0) return 'Nenhum registro encontrado.';

  const quantidade = `**${resultado.length} ${resultado.length === 1 ? 'registro' : 'registros'}**`;
  if (resultado.every((registro) => 'partitura' in registro)) {
    const total = resultado.reduce((minutos, sessao) => minutos + sessao.minutos, 0);
    return [
      `**Sessões de estudo** · ${quantidade}`,
      tabela(['ID', 'Partitura', 'Data', 'Minutos'], resultado.map((sessao) => [
        String(sessao.id), texto(sessao.partitura.titulo), dataFormatada(sessao.data), String(sessao.minutos),
      ])),
      `**Total desta listagem:** ${total} minutos`,
    ].join('\n\n');
  }
  if (resultado.every((registro) => 'compositor' in registro)) {
    return [
      `**Partituras** · ${quantidade}`,
      tabela(['ID', 'Partitura', 'Compositor', 'Status', 'PDF'], resultado.map((partitura) => [
        String(partitura.id), texto(partitura.titulo), texto(partitura.compositor.nome),
        texto(partitura.status), linkPdf(partitura.caminhoPdf),
      ])),
    ].join('\n\n');
  }
  if (resultado.every((registro) => 'nome' in registro)) {
    return [
      `**Compositores** · ${quantidade}`,
      tabela(['ID', 'Nome'], resultado.map((compositor) => [String(compositor.id), texto(compositor.nome)])),
    ].join('\n\n');
  }
  return resultado.map(ficha).join('\n\n');
}

export function formatarErro(erro: unknown): string {
  const mensagem = erro instanceof Error ? erro.message : 'Não foi possível executar a ferramenta.';
  const codigo = /^A API retornou HTTP (\d{3}):/.exec(mensagem)?.[1];
  const explicacoes: Record<string, string> = {
    '400': 'Confira os dados informados para esta operação.',
    '404': 'O registro informado não foi encontrado.',
    '409': 'Os vínculos com outros registros impedem esta operação.',
    '500': 'A API encontrou um erro ao processar a operação.',
  };
  const detalhe = codigo
    ? `${explicacoes[codigo] ?? 'A API não conseguiu concluir a operação.'} (HTTP ${codigo})`
    : mensagem;
  return `:[ **Não foi possível concluir a operação**\n\n${texto(detalhe)}`;
}
