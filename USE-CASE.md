# Apresentação rápida

Envie uma mensagem por vez, na mesma conversa.

## 1. Cadastrar uma partitura

```text
Vou começar a estudar a Gymnopédie nº 1, do Erik Satie, no piano. Cadastra essa partitura pra mim. Por enquanto, deixa sem PDF.
```

## 2. Registrar um estudo

```text
Hoje pratiquei essa música por 20 minutos. Anota que estudei os acordes da mão esquerda.
```

## 3. Atualizar o estudo

```text
Na verdade foram 30 minutos. E troca a observação: consegui juntar as duas mãos, mas ainda estou errando o ritmo.
```

## 4. Consultar os estudos por compositor

```text
Quais sessões de estudo tenho das músicas do Erik Satie?
```

Demonstra a consulta nativa com **JOIN**.

## 5. Consultar o total de minutos

```text
E qual é o total de minutos que já estudei essa Gymnopédie?
```

Demonstra a consulta nativa com **SUM**. Esperado: **30 minutos**.

## 6. Mostrar o tratamento de erro

```text
Tenta apagar essa partitura, mas sem apagar meu registro de estudo.
```

Esperado: **HTTP 409**, pois existe um estudo vinculado.

## 7. Concluir a exclusão

```text
Entendi. Então apaga primeiro esse estudo e depois a partitura. Pode manter o Satie cadastrado.
```
