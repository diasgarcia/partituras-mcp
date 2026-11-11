import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PartiturasApiService } from '../api/partituras-api.service';
import { criarListaPaginada } from '../lista-paginada';
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

  private readonly api = inject(PartiturasApiService);
  protected readonly listagem = criarListaPaginada(
    (pagina, tamanho, busca) => this.api.listarSessoesEstudo(pagina, tamanho, busca),
  );
}
