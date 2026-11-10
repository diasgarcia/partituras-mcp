import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { ListaSessoesEstudoComponent } from './lista-sessoes-estudo.component';
import { SessoesEstudoRoutingModule } from './sessoes-estudo-routing.module';

@NgModule({
  declarations: [ListaSessoesEstudoComponent],
  imports: [SessoesEstudoRoutingModule, MatTableModule, MatProgressBarModule, DatePipe],
})
export class SessoesEstudoModule {}
