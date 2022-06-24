import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Archivo } from '../models/archivo';

@Injectable({
  providedIn: 'root',
})
export class ArchivosService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    this.resourceUrl = environment.ConexionWebApiProxy + 'Archivos/';
  }

  get() {
    return this.httpClient.get(this.resourceUrl);
  }

  getById(id) {
    return this.httpClient.get(this.resourceUrl + '/' + id);
  }

  put(archivo: Archivo) {
    return this.httpClient.put(this.resourceUrl + '/' + archivo.id, archivo);
  }
}
