import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { PAGINADOR_PT_BR } from '../paginador-pt-br';
import { ListaPartiturasComponent } from './lista-partituras.component';
import { PartiturasRoutingModule } from './partituras-routing.module';

@NgModule({
  declarations: [ListaPartiturasComponent],
  imports: [
    PartiturasRoutingModule,
    MatTableModule,
    MatProgressBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
  ],
  providers: [PAGINADOR_PT_BR],
})
export class PartiturasModule {}
