import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PartiturasApiService } from '../api/partituras-api.service';
import { criarListaPaginada } from '../lista-paginada';
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

  private readonly api = inject(PartiturasApiService);
  protected readonly listagem = criarListaPaginada(
    (pagina, tamanho, busca) => this.api.listarPartituras(pagina, tamanho, busca),
  );
}
