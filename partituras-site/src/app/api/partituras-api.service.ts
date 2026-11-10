import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Compositor } from '../modelos/compositor';
import type { Partitura } from '../modelos/partitura';
import type { SessaoEstudo } from '../modelos/sessao-estudo';

@Injectable({ providedIn: 'root' })
export class PartiturasApiService {
  private readonly http = inject(HttpClient);

  listarPartituras(): Observable<readonly Partitura[]> {
    return this.http.get<readonly Partitura[]>('/api/partituras');
  }

  listarCompositores(): Observable<readonly Compositor[]> {
    return this.http.get<readonly Compositor[]>('/api/compositores');
  }

  listarSessoesEstudo(): Observable<readonly SessaoEstudo[]> {
    return this.http.get<readonly SessaoEstudo[]>('/api/sessoes-estudo');
  }
}
