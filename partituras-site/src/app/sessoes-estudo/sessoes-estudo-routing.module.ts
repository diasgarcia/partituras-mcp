import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { ListaSessoesEstudoComponent } from './lista-sessoes-estudo.component';

const rotas: Routes = [{ path: '', component: ListaSessoesEstudoComponent, title: 'Sessões de estudo | Acervo de partituras' }];

@NgModule({
  imports: [RouterModule.forChild(rotas)],
  exports: [RouterModule],
})
export class SessoesEstudoRoutingModule {}
