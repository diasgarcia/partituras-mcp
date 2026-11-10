# Partituras Site

Site de consulta de partituras, compositores e sessões de estudo. As tabelas leem a API Spring. Os cadastros e as edições são feitos pelo MCP.

Com a API rodando na porta 8080, execute na raiz do repositório.

```bash
npm --prefix partituras-site start
```

O Dev Container instala as dependências durante a preparação. Fora do container, rode `npm --prefix partituras-site ci` na primeira vez.

Abra `http://localhost:4200` no computador ou a porta **4200** na aba **Ports** do Codespaces.

O proxy do Angular encaminha os três GETs de `/api` para o Spring. Para gerar o build do site, use `npm --prefix partituras-site run build`.
