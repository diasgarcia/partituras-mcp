import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { PartiturasApiService } from '../api/partituras-api.service';
import type { SessaoEstudo } from '../modelos/sessao-estudo';

@Component({
  selector: 'app-lista-sessoes-estudo',
  standalone: false,
  templateUrl: './lista-sessoes-estudo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaSessoesEstudoComponent {
  protected readonly colunas: readonly (keyof SessaoEstudo)[] = [
    'data', 'partitura', 'minutos', 'observacoes',
  ];

  protected readonly sessoes = toSignal(
    inject(PartiturasApiService).listarSessoesEstudo().pipe(catchError(() => of(null))),
  );
}
