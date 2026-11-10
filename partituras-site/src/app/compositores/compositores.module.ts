import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { ListaCompositoresComponent } from './lista-compositores.component';
import { CompositoresRoutingModule } from './compositores-routing.module';

@NgModule({
  declarations: [ListaCompositoresComponent],
  imports: [CompositoresRoutingModule, MatTableModule, MatProgressBarModule],
})
export class CompositoresModule {}
