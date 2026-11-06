# Apresentação rápida do Partituras MCP

Inicie a API e o MCP conforme o [README](README.md). Envie os pedidos abaixo, um por vez, na mesma conversa da LLM. Mantenha a API rodando: reiniciá-la recria o banco.

## 1. Cadastrar uma partitura

```text
Use o MCP partituras. Encontre Beethoven entre os compositores cadastrados e cadastre uma nova partitura chamada "Für Elise", para Piano, dificuldade Intermediária, status Em andamento e sem PDF.

Mostre a ficha e guarde os IDs retornados. Nos próximos passos, use somente a partitura criada agora, mesmo que já exista outra com o mesmo título.
```

Mostra o cadastro e o vínculo entre partitura e compositor, sem precisar criar outro compositor.

## 2. Registrar um estudo

```text
Registre uma sessão de estudo para essa nova partitura na data de hoje, com 20 minutos e a observação "Pratiquei a introdução com as mãos separadas". Mostre o registro criado e guarde o ID da sessão.
```

## 3. Atualizar a sessão

```text
Atualize essa mesma sessão para 30 minutos e troque a observação por "Consegui tocar a introdução com as duas mãos". Mantenha a data e a partitura. Mostre como ficou.
```

## 4. Consultar os estudos e o total

```text
Consulte os estudos de Beethoven pela consulta por compositor. Depois, consulte o total de minutos da partitura que criamos agora.
```

Mostra as consultas com **JOIN** e **SUM**. O total da nova partitura deve ser **30 minutos**; a listagem do compositor pode incluir estudos de outras partituras.

## 5. Mostrar um erro tratado

```text
Tente excluir a partitura que criamos agora, mantendo a sessão vinculada. Se houver bloqueio, explique o motivo e consulte a partitura e a sessão para confirmar que continuam salvas. Não remova a sessão para contornar o erro.
```

Esperado: **HTTP 409**, pois a partitura tem um estudo vinculado. Mostra a proteção dos relacionamentos e a explicação do erro pela LLM.

## Se sobrar tempo: concluir a exclusão

```text
Agora exclua primeiro a sessão e depois a partitura criadas nesta apresentação. Preserve Beethoven e todos os registros que já existiam.
```

Mostra que a exclusão funciona quando os vínculos são removidos na ordem correta.
