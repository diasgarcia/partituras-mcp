import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { PartiturasApiService } from '../api/partituras-api.service';
import type { Partitura } from '../modelos/partitura';

@Component({
  selector: 'app-lista-partituras',
  standalone: false,
  templateUrl: './lista-partituras.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaPartiturasComponent {
  protected readonly colunas: readonly (keyof Partitura)[] = [
    'titulo', 'compositor', 'instrumento', 'dificuldade', 'status', 'caminhoPdf',
  ];

  protected readonly partituras = toSignal(
    inject(PartiturasApiService).listarPartituras().pipe(catchError(() => of(null))),
  );
}
