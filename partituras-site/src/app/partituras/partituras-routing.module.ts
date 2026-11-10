import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { ListaPartiturasComponent } from './lista-partituras.component';

const rotas: Routes = [{ path: '', component: ListaPartiturasComponent, title: 'Partituras | Acervo de partituras' }];

@NgModule({
  imports: [RouterModule.forChild(rotas)],
  exports: [RouterModule],
})
export class PartiturasRoutingModule {}
