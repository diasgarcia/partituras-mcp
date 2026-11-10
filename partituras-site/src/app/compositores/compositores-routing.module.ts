import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { ListaCompositoresComponent } from './lista-compositores.component';

const rotas: Routes = [{ path: '', component: ListaCompositoresComponent, title: 'Compositores | Acervo de partituras' }];

@NgModule({
  imports: [RouterModule.forChild(rotas)],
  exports: [RouterModule],
})
export class CompositoresRoutingModule {}
