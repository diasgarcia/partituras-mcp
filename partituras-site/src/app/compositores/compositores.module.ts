import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { PAGINADOR_PT_BR } from '../paginador-pt-br';
import { ListaCompositoresComponent } from './lista-compositores.component';
import { CompositoresRoutingModule } from './compositores-routing.module';

@NgModule({
  declarations: [ListaCompositoresComponent],
  imports: [
    CompositoresRoutingModule,
    MatTableModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
  ],
  providers: [PAGINADOR_PT_BR],
})
export class CompositoresModule {}
