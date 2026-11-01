import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { after, before, beforeEach, test } from 'node:test';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { ClienteApi } from '../dist/api/cliente-api.js';
import { criarServidorHttp } from '../dist/http/servidor-http.js';

// A API simulada segue os contratos dos controladores Java e da coleção Postman.
// O servidor MCP e seu cliente HTTP rodam de verdade, sem acessar o banco do projeto.
const compositor = { id: 13, nome: 'Compositor de teste' };
const partitura = {
  id: 27,
  titulo: 'Estudo de teste',
  instrumento: null,
  dificuldade: null,
  status: null,
  caminhoPdf: null,
  compositor,
};
const sessao = {
  id: 41,
  partitura,
  data: '2026-11-01',
  minutos: 25,
  observacoes: null,
};

let api;
let servidor;
let clienteMcp;
let endereco;
let identificador = 0;
let chamadas = [];
let responder;

async function escutar(servidorHttp) {
  servidorHttp.listen(0, '127.0.0.1');
  await once(servidorHttp, 'listening');
  return `http://127.0.0.1:${servidorHttp.address().port}`;
}

async function encerrar(servidorHttp) {
  const encerrado = once(servidorHttp, 'close');
  servidorHttp.close();
  servidorHttp.closeAllConnections();
  await encerrado;
}

async function requisicaoMcp(method, params = {}, versao = '2025-11-25') {
  const resposta = await fetch(`${endereco}/mcp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      'MCP-Protocol-Version': versao,
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++identificador, method, params }),
  });
  const texto = await resposta.text();
  assert.equal(resposta.status, 200, texto);
  const conteudo = resposta.headers.get('content-type')?.includes('text/event-stream')
    ? texto.split('\n').find((linha) => linha.startsWith('data:')).slice(5)
    : texto;
  const mensagem = JSON.parse(conteudo);
  assert.equal(mensagem.error, undefined, JSON.stringify(mensagem.error));
  return mensagem.result;
}

function chamarFerramenta(name, argumentos = {}) {
  return clienteMcp.callTool({ name, arguments: argumentos });
}

async function conectarCliente(url) {
  const cliente = new Client(
    { name: 'teste-partituras', version: '1.0.0' },
    { versionNegotiation: { mode: 'auto' } },
  );
  await cliente.connect(new StreamableHTTPClientTransport(new URL(`${url}/mcp`)));
  return cliente;
}

before(async () => {
  api = createServer(async (requisicao, resposta) => {
    const partes = [];
    for await (const parte of requisicao) partes.push(parte);
    const texto = Buffer.concat(partes).toString();
    const chamada = {
      metodo: requisicao.method,
      caminho: requisicao.url,
      dados: texto ? JSON.parse(texto) : undefined,
    };
    chamadas.push(chamada);
    const retorno = responder(chamada);
    resposta.writeHead(retorno.status ?? 200, { 'Content-Type': 'application/json' });
    resposta.end(retorno.texto ?? JSON.stringify(retorno.dados));
  });
  const urlApi = await escutar(api);
  servidor = criarServidorHttp(new ClienteApi(`${urlApi}/`));
  endereco = await escutar(servidor);
  clienteMcp = await conectarCliente(endereco);
});

beforeEach(() => {
  chamadas = [];
  responder = () => ({ status: 501, dados: { erro: 'Chamada não prevista no teste.' } });
});

after(async () => {
  if (clienteMcp) await clienteMcp.close();
  if (servidor) await encerrar(servidor);
  if (api) await encerrar(api);
});

for (const versao of ['2025-03-26', '2025-06-18', '2025-11-25']) {
  test(`negocia o protocolo MCP ${versao} por HTTP`, async () => {
    const resultado = await requisicaoMcp('initialize', {
      protocolVersion: versao,
      clientInfo: { name: 'teste-partituras', version: '1.0.0' },
      capabilities: {},
    }, versao);
    assert.equal(resultado.serverInfo.name, 'partituras');
    assert.equal(resultado.protocolVersion, versao);
    assert.deepEqual(chamadas, []);
  });
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
  partitura: { id: partitura.id },
  data: sessao.data,
  minutos: sessao.minutos,
  observacoes: null,
};

const casos = [
  ['listar_compositores', {}, 'GET', '/compositores', undefined, [compositor]],
  ['buscar_compositor', { compositor_id: 13 }, 'GET', '/compositores/13', undefined, compositor],
  ['cadastrar_compositor', { nome: compositor.nome }, 'POST', '/compositores', { nome: compositor.nome }, compositor],
  ['atualizar_compositor', { compositor_id: 13, nome: compositor.nome }, 'PUT', '/compositores/13', { nome: compositor.nome }, compositor],
  ['excluir_compositor', { compositor_id: 13 }, 'DELETE', '/compositores/13', undefined, 'Compositor excluído.'],
  ['listar_partituras', {}, 'GET', '/partituras', undefined, [partitura]],
  ['buscar_partitura', { partitura_id: 27 }, 'GET', '/partituras/27', undefined, partitura],
  ['cadastrar_partitura', { titulo: partitura.titulo, compositor_id: 13 }, 'POST', '/partituras', dadosPartitura, partitura],
  ['atualizar_partitura', { partitura_id: 27, titulo: partitura.titulo, compositor_id: 13 }, 'PUT', '/partituras/27', dadosPartitura, partitura],
  ['excluir_partitura', { partitura_id: 27 }, 'DELETE', '/partituras/27', undefined, 'Partitura excluída.'],
  ['listar_sessoes_estudo', {}, 'GET', '/sessoes-estudo', undefined, [sessao]],
  ['buscar_sessao_estudo', { sessao_id: 41 }, 'GET', '/sessoes-estudo/41', undefined, sessao],
  ['registrar_estudo', { partitura_id: 27, data: sessao.data, minutos: 25 }, 'POST', '/sessoes-estudo', dadosEstudo, sessao],
  ['atualizar_estudo', { sessao_id: 41, partitura_id: 27, data: sessao.data, minutos: 25 }, 'PUT', '/sessoes-estudo/41', dadosEstudo, sessao],
  ['excluir_estudo', { sessao_id: 41 }, 'DELETE', '/sessoes-estudo/41', undefined, 'Sessão de estudo excluída.'],
  ['buscar_estudos_por_compositor', { compositor_id: 13 }, 'GET', '/sessoes-estudo/compositor/13', undefined, [sessao]],
  ['total_minutos_por_partitura', { partitura_id: 27 }, 'GET', '/sessoes-estudo/partitura/27/total-minutos', undefined, 55],
];

test('atende chamadas de ferramentas pelo protocolo 2025 usado por clientes existentes', async () => {
  responder = () => ({ dados: 55 });
  const resultado = await requisicaoMcp('tools/call', {
    name: 'total_minutos_por_partitura',
    arguments: { partitura_id: 27 },
  }, '2025-03-26');
  assert.notEqual(resultado.isError, true);
  assert.deepEqual(resultado.structuredContent, { resultado: 55 });
  assert.equal(chamadas[0].caminho, '/sessoes-estudo/partitura/27/total-minutos');
});

test('publica as 17 ferramentas, seus tipos e as orientações de PDF', async () => {
  const { tools } = await clienteMcp.listTools();
  assert.deepEqual(tools.map((ferramenta) => ferramenta.name).sort(), casos.map(([nome]) => nome).sort());
  for (const ferramenta of tools) {
    assert.equal(ferramenta.inputSchema.type, 'object');
    assert.ok(ferramenta.outputSchema);
  }
  for (const nome of ['cadastrar_partitura', 'atualizar_partitura']) {
    const ferramenta = tools.find((item) => item.name === nome);
    assert.match(ferramenta.description, /IMSLP/);
    assert.match(ferramenta.description, /exatamente como foi informado/);
    assert.match(ferramenta.description, /Nunca invente/);
  }
});

for (const [nome, argumentos, metodo, caminho, dados, esperado] of casos) {
  test(`${nome}: encaminha o contrato REST e devolve os dados`, async () => {
    responder = () => metodo === 'DELETE'
      ? { status: 204, texto: '' }
      : { status: metodo === 'POST' ? 201 : 200, dados: esperado };

    const resultado = await chamarFerramenta(nome, argumentos);

    assert.notEqual(resultado.isError, true);
    assert.deepEqual(resultado.structuredContent, { resultado: esperado });
    assert.deepEqual(chamadas, [{ metodo, caminho, dados }]);
  });
}

test('preserva o link de PDF e os campos opcionais enviados', async () => {
  const preenchida = {
    ...partitura,
    instrumento: 'Piano',
    dificuldade: 'Iniciante',
    status: 'Em andamento',
    caminhoPdf: 'https://imslp.org/wiki/Obra_de_teste',
  };
  responder = () => ({ status: 201, dados: preenchida });
  const resultado = await chamarFerramenta('cadastrar_partitura', {
    titulo: preenchida.titulo,
    compositor_id: 13,
    instrumento: preenchida.instrumento,
    dificuldade: preenchida.dificuldade,
    status: preenchida.status,
    caminho_pdf: preenchida.caminhoPdf,
  });
  assert.deepEqual(resultado.structuredContent.resultado, preenchida);
  assert.deepEqual(chamadas[0].dados, {
    titulo: preenchida.titulo,
    compositor: { id: 13 },
    instrumento: preenchida.instrumento,
    dificuldade: preenchida.dificuldade,
    status: preenchida.status,
    caminhoPdf: preenchida.caminhoPdf,
  });
});

for (const status of [404, 409, 500]) {
  test(`informa HTTP ${status} da API como erro da ferramenta`, async () => {
    responder = () => ({ status, dados: { status, error: 'Erro da API' } });
    const resultado = await chamarFerramenta('excluir_compositor', { compositor_id: 13 });
    assert.equal(resultado.isError, true);
    assert.match(resultado.content[0].text, new RegExp(`HTTP ${status}`));
    assert.equal(chamadas.length, 1);
  });
}

for (const [descricao, nome, argumentos] of [
  ['ID inválido', 'buscar_compositor', { compositor_id: -1 }],
  ['ID como texto', 'buscar_partitura', { partitura_id: '27' }],
  ['nome vazio', 'cadastrar_compositor', { nome: '   ' }],
  ['minutos zerados', 'registrar_estudo', { partitura_id: 27, data: '2026-11-01', minutos: 0 }],
  ['data impossível', 'registrar_estudo', { partitura_id: 27, data: '2026-02-30', minutos: 25 }],
]) {
  test(`rejeita ${descricao} antes de chamar a API`, async () => {
    const resultado = await chamarFerramenta(nome, argumentos);
    assert.equal(resultado.isError, true);
    assert.deepEqual(chamadas, []);
  });
}

for (const [descricao, retorno] of [
  ['JSON inválido', { texto: '<html>Erro inesperado</html>' }],
  ['campos de outro tipo', { dados: { id: '13', nome: compositor.nome } }],
]) {
  test(`informa ${descricao} na resposta da API`, async () => {
    responder = () => retorno;
    const resultado = await chamarFerramenta('buscar_compositor', { compositor_id: 13 });
    assert.equal(resultado.isError, true);
    assert.match(resultado.content[0].text, /formato inesperado/);
  });
}

test('informa quando o Spring está indisponível', async () => {
  const temporario = createServer();
  const urlInativa = await escutar(temporario);
  await encerrar(temporario);
  const servidorSemApi = criarServidorHttp(new ClienteApi(urlInativa));
  let clienteSemApi;
  try {
    clienteSemApi = await conectarCliente(await escutar(servidorSemApi));
    const resultado = await clienteSemApi.callTool({ name: 'listar_compositores', arguments: {} });
    assert.equal(resultado.isError, true);
    assert.match(resultado.content[0].text, /Verifique se o Spring está rodando/);
  } finally {
    if (clienteSemApi) await clienteSemApi.close();
    await encerrar(servidorSemApi);
  }
});

test('responde 404 para caminhos fora de /mcp', async () => {
  const resposta = await fetch(`${endereco}/outro`);
  assert.equal(resposta.status, 404);
});
