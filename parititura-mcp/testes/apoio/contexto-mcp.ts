import type { ServerContext } from '@modelcontextprotocol/server';
import { vi } from 'vitest';

export function criarContextoMcp(dados: Partial<ServerContext['mcpReq']> = {}): ServerContext {
  return {
    mcpReq: {
      id: 1,
      method: 'tools/call',
      signal: new AbortController().signal,
      requestState: () => undefined,
      send: vi.fn(),
      notify: vi.fn(),
      log: vi.fn(),
      elicitInput: vi.fn(),
      requestSampling: vi.fn(),
      ...dados,
    },
  };
}
