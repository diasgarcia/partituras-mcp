export interface Pagina<T> {
  readonly conteudo: readonly T[];
  readonly total: number;
}
