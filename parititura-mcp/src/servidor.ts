import { McpServer } from '@modelcontextprotocol/server';
import type { ClienteApi } from './api/cliente-api.js';
import { registrarFerramentasCompositores } from './ferramentas/compositores.js';
import { registrarFerramentasPartituras } from './ferramentas/partituras.js';
import { registrarFerramentasSessoesEstudo } from './ferramentas/sessoes-estudo.js';

const instrucoesApresentacao = `Apresente os resultados das ferramentas de partituras em português, com Markdown claro e conciso.
Transforme os dados retornados em uma resposta para o usuário. Exiba JSON somente quando ele pedir explicitamente esse formato.

- Em cadastros e atualizações, confirme a operação e destaque o nome ou título e o ID retornado.
- Para vários cadastros, use uma tabela com as colunas Registro, Nome ou título e ID, sem repetir os mesmos dados em outras listas.
- Nas listagens, use tabelas com os campos úteis ao pedido. Identifique compositores e partituras pelos nomes, além dos IDs necessários.
- Nas sessões de estudo, apresente a partitura, a data e os minutos. Mostre somas com a unidade, por exemplo: 55 minutos de estudo.
- Apresente datas ao usuário como DD/MM/AAAA; envie datas às ferramentas no formato AAAA-MM-DD exigido por elas.
- Exiba PDFs como links Markdown. Quando não houver link, escreva "Sem PDF cadastrado". Respeite pedidos explícitos para deixar o PDF vazio.
- Se uma consulta não retornar registros, explique isso em uma frase.
- Se uma operação falhar, explique o problema de forma compreensível e preserve informações úteis, como o ID e o código HTTP. Nunca confirme sucesso quando a ferramenta retornar erro.
- Use apenas os dados efetivamente retornados pelas ferramentas. Não invente IDs, registros, links ou resultados.
- Evite mostrar nomes internos de ferramentas, o campo resultado, payloads e logs na resposta final. Esses detalhes só devem aparecer quando forem solicitados.

Estas orientações se aplicam à apresentação das respostas; respeite outro formato solicitado pelo usuário.`;

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
