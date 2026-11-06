
# Partituras MCP

CRUD de compositores, partituras e registros de estudo com Spring Boot, MySQL e um servidor MCP em TypeScript.

## Quickstart

No GitHub, abra o repositório e selecione **Code → Codespaces → Create codespace on main**. Aguarde a preparação do ambiente. Não é necessário instalar Java, Node.js, Maven ou MySQL no seu computador.

O devcontainer instala Java 21, Maven, Node.js 24 e MySQL 8. Também inicia e configura o banco e executa automaticamente:

```bash
npm --prefix partituras-mcp ci
npm --prefix partituras-mcp run build
mvn -B -f partituras-api/pom.xml -DskipTests package
```

Com o MySQL iniciado pelo container, execute os comandos abaixo na raiz do projeto, em dois terminais do Codespaces.

**Terminal 1 — API:**

```bash
mvn -f partituras-api/pom.xml spring-boot:run
```

**Terminal 2 — MCP:**

```bash
npm --prefix partituras-mcp start
```

Para desenvolver com reinício automático, use `npm --prefix partituras-mcp run dev` no segundo terminal. Se o Codespace já existia, execute **Codespaces: Rebuild Container** para instalar o Node.js e as dependências.

## Código do MCP

Em `partituras-mcp/src`, `interfaces` representa os dados da API, `esquemas` valida as respostas, `api` concentra as chamadas ao Spring e `ferramentas` registra as operações MCP por assunto. `http` configura o transporte; `servidor.ts` reúne as ferramentas e `index.ts` inicia o processo.

O projeto usa o SDK oficial e Zod. Para verificar os tipos e executar os testes:

```bash
npm --prefix partituras-mcp run check
npm --prefix partituras-mcp test
```

Os testes do MCP estão em `partituras-mcp/testes/unitarios`, escritos em TypeScript com Vitest e separados em **Arrange, Act e Assert (AAA)**. Usam mocks e não precisam iniciar API, MCP ou banco. Para executá-los a cada alteração, use `npm --prefix partituras-mcp run test:watch`.

As variáveis opcionais `PARTITURAS_API_URL` e `PORT` alteram o endereço da API e a porta do MCP. Os padrões são `http://localhost:8080` e `8000`.

A versão Python está em `partituras-mcp-old`. Sua feature e instalação ficaram comentadas em `.devcontainer/devcontainer.json` e `.devcontainer/preparar-ambiente.sh`. Para utilizá-la, habilite essas linhas, reconstrua o container e execute `python partituras-mcp-old/partituras_mcp.py` no segundo terminal.

## Apresentação das respostas

O MCP envia à LLM instruções para responder em português, com fichas para registros individuais, tabelas para listagens, links de PDF e totais em minutos. As ferramentas também retornam esse texto em Markdown e mantêm os dados tipados em `structuredContent`. JSON na resposta final fica reservado aos pedidos explícitos do usuário. A apresentação da LLM segue essas instruções; a renderização visual depende do cliente.

Ao registrar um estudo sem data ou minutos, o MCP solicita os dados por um formulário padrão MCP, se o cliente anunciar suporte. Sem formulário, os dados são pedidos pela conversa. Cancelar ou recusar o formulário não salva o estudo. Com os dados completos, o cadastro segue normalmente.

Para testar esta branch, reinicie o MCP com `npm --prefix partituras-mcp run dev` e reconecte o cliente em uma nova conversa para carregar as instruções. Os exemplos estão no [USE-CASE.md](USE-CASE.md).

## Portas e acesso

| Serviço   | Porta | Endereço                 |
| ---------- | ----- | ------------------------- |
| API Spring | 8080  | http://localhost:8080     |
| MCP HTTP   | 8000  | http://localhost:8000/mcp |
| MySQL      | 3306  | localhost:3306            |

MySQL: banco `mcp-partituras`, usuário `rafael`, senha `q1w2e3`.

Os endereços `localhost` são internos ao Codespaces. Para acessar de fora, copie os endereços encaminhados na aba **Ports**: porta 8080 para a API e porta 8000 com `/mcp` no final para o MCP.

Para testar a API, importe `partituras-api/partituras.postman_collection.json` no Postman e configure `api_url` com o endereço encaminhado da porta 8080. Para o MCP, crie uma requisição **MCP → HTTP**, informe o endereço encaminhado da porta 8000 com `/mcp` e clique em **Connect**.

Na configuração atual, iniciar a API recria as tabelas e carrega os exemplos de `import.sql`.

## OpenCode

No OpenCode, com a API e o MCP iniciados, adicione este bloco dentro de `mcp` no seu `opencode.jsonc`:

```json
"partituras": {
  "type": "remote",
  "url": "http://localhost:8000/mcp",
  "enabled": true
}
```

Se o OpenCode estiver fora do Codespaces, use o endereço encaminhado da porta 8000 com `/mcp` no final.
