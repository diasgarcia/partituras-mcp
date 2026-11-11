import { computed, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, type Observable, of, switchMap, timer } from 'rxjs';
import type { Pagina } from './modelos/pagina';

export function criarListaPaginada<T>(
  carregar: (pagina: number, tamanho: number, busca: string) => Observable<Pagina<T>>,
) {
  const tamanho = 5;
  const consulta = signal({ pagina: 0, busca: '', aguardarDigitacao: false });
  const resultado = toSignal(
    toObservable(consulta).pipe(
      switchMap(consultaAtual => {
        const inicio = consultaAtual.aguardarDigitacao ? timer(100) : of(0);

        return inicio.pipe(
          switchMap(() => carregar(consultaAtual.pagina, tamanho, consultaAtual.busca)),
          catchError(() => of(null)),
          map(pagina => ({ consulta: consultaAtual, pagina })),
        );
      }),
    ),
  );

  return {
    tamanho,
    resultado,
    busca: computed(() => consulta().busca),
    carregando: computed(() => resultado()?.consulta !== consulta()),
    filtrar(busca: string): void {
      consulta.set({ pagina: 0, busca: busca.trim(), aguardarDigitacao: true });
    },
    mudarPagina(pagina: number): void {
      consulta.update(atual => ({ ...atual, pagina, aguardarDigitacao: false }));
    },
  };
}
