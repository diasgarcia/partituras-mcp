import { createServer, type Server } from 'node:http';
import { createMcpHandler } from '@modelcontextprotocol/server';
import { toNodeHandler } from '@modelcontextprotocol/node';
import type { ClienteApi } from '../api/cliente-api.js';
import { criarServidorMcp } from '../servidor.js';

export function criarServidorHttp(cliente: ClienteApi): Server {
  const handler = createMcpHandler(() => criarServidorMcp(cliente));
  const tratarRequisicao = toNodeHandler(handler);

  const servidor = createServer((requisicao, resposta) => {
    if (requisicao.url?.split('?')[0] !== '/mcp') {
      resposta.writeHead(404, { 'Content-Type': 'application/json' });
      resposta.end(JSON.stringify({ erro: 'Endpoint não encontrado. Use /mcp.' }));
      return;
    }

    void tratarRequisicao(requisicao, resposta);
  });

  servidor.on('close', () => { void handler.close(); });

  return servidor;
}
