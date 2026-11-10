import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly secoes = [
    { caminho: '/partituras', rotulo: 'Partituras' },
    { caminho: '/compositores', rotulo: 'Compositores' },
    { caminho: '/sessoes-estudo', rotulo: 'Sessões de estudo' },
  ] as const;
}
