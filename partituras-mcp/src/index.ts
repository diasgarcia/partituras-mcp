import { ClienteApi } from './api/cliente-api.js';
import { carregarConfiguracao } from './configuracao.js';
import { criarServidorHttp } from './http/servidor-http.js';

const configuracao = carregarConfiguracao();
const cliente = new ClienteApi(configuracao.urlApi);
const servidor = criarServidorHttp(cliente);

servidor.listen(configuracao.porta, '0.0.0.0', () => {
  console.log(`MCP disponível em http://localhost:${configuracao.porta}/mcp`);
});

servidor.on('error', (erro) => {
  console.error('Não foi possível iniciar o servidor MCP:', erro.message);
  process.exitCode = 1;
});

function encerrar(): void {
  servidor.close();
  servidor.closeAllConnections();
}

process.once('SIGINT', encerrar);
process.once('SIGTERM', encerrar);
