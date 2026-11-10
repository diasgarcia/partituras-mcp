import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';

const rotas: Routes = [
  { path: '', redirectTo: 'partituras', pathMatch: 'full' },
  {
    path: 'partituras',
    loadChildren: () => import('./partituras/partituras.module').then(m => m.PartiturasModule),
  },
  {
    path: 'compositores',
    loadChildren: () => import('./compositores/compositores.module').then(m => m.CompositoresModule),
  },
  {
    path: 'sessoes-estudo',
    loadChildren: () => import('./sessoes-estudo/sessoes-estudo.module').then(m => m.SessoesEstudoModule),
  },
  { path: '**', redirectTo: 'partituras' },
];

@NgModule({
  imports: [RouterModule.forRoot(rotas)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
