import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { PartiturasApiService } from '../api/partituras-api.service';
import type { Compositor } from '../modelos/compositor';

@Component({
  selector: 'app-lista-compositores',
  standalone: false,
  templateUrl: './lista-compositores.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaCompositoresComponent {
  protected readonly colunas: readonly (keyof Compositor)[] = [
    'id', 'nome',
  ];

  protected readonly compositores = toSignal(
    inject(PartiturasApiService).listarCompositores().pipe(catchError(() => of(null))),
  );
}
