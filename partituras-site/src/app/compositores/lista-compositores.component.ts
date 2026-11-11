import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PartiturasApiService } from '../api/partituras-api.service';
import { criarListaPaginada } from '../lista-paginada';
import type { Compositor } from '../modelos/compositor';

@Component({
  selector: 'app-lista-compositores',
  standalone: false,
  templateUrl: './lista-compositores.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaCompositoresComponent {
  protected readonly colunas: readonly (keyof Compositor)[] = [
    'id', 'nome', 'anoNascimento', 'anoFalecimento',
  ];

  private readonly api = inject(PartiturasApiService);
  protected readonly listagem = criarListaPaginada(
    (pagina, tamanho, busca) => this.api.listarCompositores(pagina, tamanho, busca),
  );
}
