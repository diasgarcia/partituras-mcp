import type { Provider } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

export const PAGINADOR_PT_BR: Provider = {
  provide: MatPaginatorIntl,
  useFactory: () => {
    const rotulos = new MatPaginatorIntl();
    rotulos.previousPageLabel = 'Página anterior';
    rotulos.nextPageLabel = 'Próxima página';
    rotulos.firstPageLabel = 'Primeira página';
    rotulos.lastPageLabel = 'Última página';
    rotulos.getRangeLabel = (pagina, tamanho, total) => {
      const inicio = pagina * tamanho + 1;
      const fim = Math.min((pagina + 1) * tamanho, total);
      return inicio > total ? `0 de ${total}` : `${inicio}–${fim} de ${total}`;
    };
    return rotulos;
  },
};
