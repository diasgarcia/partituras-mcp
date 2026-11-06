import { McpServer } from '@modelcontextprotocol/server';
import type { ClienteApi } from './api/cliente-api.js';
import { registrarFerramentasCompositores } from './ferramentas/compositores.js';
import { registrarFerramentasPartituras } from './ferramentas/partituras.js';
import { registrarFerramentasSessoesEstudo } from './ferramentas/sessoes-estudo.js';

const instrucoesApresentacao = `Responda em português e siga este padrão de apresentação em Markdown ao usar as ferramentas de partituras:

- Cadastro ou atualização de um registro: confirme a operação e apresente uma ficha em citação Markdown, com nome ou título em destaque, ID e os campos relevantes em linhas separadas.
- Vários cadastros ou atualizações: apresente uma única tabela com Registro, Nome ou título e ID. Não repita os mesmos dados em outras listas.
- Listagens: use tabelas com os campos úteis ao pedido. Mostre nomes além dos IDs necessários para identificar os registros e seus relacionamentos.
- Sessões de estudo: mostre partitura, data e minutos. Destaque os totais com a unidade e deixe claro quando a soma corresponde apenas à listagem exibida.
- Datas: exiba DD/MM/AAAA ao usuário e envie AAAA-MM-DD às ferramentas. PDF: use links Markdown; quando não houver, escreva "Sem PDF cadastrado".
- Exclusões: confirme de forma breve somente depois do sucesso da ferramenta. Consultas vazias: informe em uma frase que não há registros.
- Erros: explique o problema em linguagem clara e preserve o código HTTP quando houver. Nunca apresente uma operação como concluída se a ferramenta falhou.

Use apenas os dados confirmados pelas ferramentas. Não invente registros, IDs, links ou resultados.
Se faltarem dados necessários, solicite-os antes de cadastrar. Use o formulário quando o cliente oferecer suporte; caso contrário, pergunte na conversa. Respeite cancelamentos e pedidos para deixar campos opcionais vazios.
Evite emojis. Quando fizer sentido, prefira emoticons de texto, como :] e :[, com moderação.
Não exponha JSON, payloads, logs, nomes internos de ferramentas ou o campo resultado na resposta final, salvo se o usuário solicitar esses detalhes.
Mantenha as respostas concisas e siga o padrão acima, respeitando outro formato explicitamente pedido pelo usuário.`;

export function criarServidorMcp(cliente: ClienteApi): McpServer {
  const servidor = new McpServer(
    { name: 'partituras', version: '0.1.0' },
    { instructions: instrucoesApresentacao },
  );

  registrarFerramentasCompositores(servidor, cliente);
  registrarFerramentasPartituras(servidor, cliente);
  registrarFerramentasSessoesEstudo(servidor, cliente);

  return servidor;
}
