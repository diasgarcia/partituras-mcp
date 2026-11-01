import { McpServer } from '@modelcontextprotocol/server';
import type { ClienteApi } from './api/cliente-api.js';
import { registrarFerramentasCompositores } from './ferramentas/compositores.js';
import { registrarFerramentasPartituras } from './ferramentas/partituras.js';
import { registrarFerramentasSessoesEstudo } from './ferramentas/sessoes-estudo.js';

export function criarServidorMcp(cliente: ClienteApi): McpServer {
  const servidor = new McpServer({ name: 'partituras', version: '0.1.0' });

  registrarFerramentasCompositores(servidor, cliente);
  registrarFerramentasPartituras(servidor, cliente);
  registrarFerramentasSessoesEstudo(servidor, cliente);

  return servidor;
}
