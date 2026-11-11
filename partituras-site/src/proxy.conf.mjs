export default {
  '^/api/(partituras|compositores|sessoes-estudo)([?].*)?$': {
    target: 'http://127.0.0.1:8080',
    rewrite: caminho => caminho.slice('/api'.length),
    bypass: requisicao => requisicao.method === 'GET' ? undefined : false,
  },
};
