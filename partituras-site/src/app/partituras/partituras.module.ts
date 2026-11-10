import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { ListaPartiturasComponent } from './lista-partituras.component';
import { PartiturasRoutingModule } from './partituras-routing.module';

@NgModule({
  declarations: [ListaPartiturasComponent],
  imports: [PartiturasRoutingModule, MatTableModule, MatProgressBarModule, MatButtonModule],
})
export class PartiturasModule {}
