import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { PAGINADOR_PT_BR } from '../paginador-pt-br';
import { ListaSessoesEstudoComponent } from './lista-sessoes-estudo.component';
import { SessoesEstudoRoutingModule } from './sessoes-estudo-routing.module';

@NgModule({
  declarations: [ListaSessoesEstudoComponent],
  imports: [
    SessoesEstudoRoutingModule,
    MatTableModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    DatePipe,
  ],
  providers: [PAGINADOR_PT_BR],
})
export class SessoesEstudoModule {}
