import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Compositor } from '../modelos/compositor';
import type { Pagina } from '../modelos/pagina';
import type { Partitura } from '../modelos/partitura';
import type { SessaoEstudo } from '../modelos/sessao-estudo';

@Injectable({ providedIn: 'root' })
export class PartiturasApiService {
  private readonly http = inject(HttpClient);

  listarPartituras(pagina: number, tamanho: number, busca: string): Observable<Pagina<Partitura>> {
    return this.http.get<Pagina<Partitura>>('/api/partituras', {
      params: { page: pagina, size: tamanho, busca },
    });
  }

  listarCompositores(pagina: number, tamanho: number, busca: string): Observable<Pagina<Compositor>> {
    return this.http.get<Pagina<Compositor>>('/api/compositores', {
      params: { page: pagina, size: tamanho, busca },
    });
  }

  listarSessoesEstudo(pagina: number, tamanho: number, busca: string): Observable<Pagina<SessaoEstudo>> {
    return this.http.get<Pagina<SessaoEstudo>>('/api/sessoes-estudo', {
      params: { page: pagina, size: tamanho, busca },
    });
  }
}
