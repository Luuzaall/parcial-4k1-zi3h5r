import { Component, OnInit } from '@angular/core';

import { Archivo } from '../../models/archivo';

import { ArchivosService } from '../../services/archivos.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDialogService } from '../../services/modal-dialog.service';

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css'],
})
export class ArchivosComponent implements OnInit {
  Titulo = 'Archivos';
  AccionLM = 'L'; // Inicializa con el listado

  Archivos: Archivo[] = null;
  IdArchivoEnModificacion: number = null;
  submitted = false; // Se inicializa el booleano del formulario si
  // se quiso mandar.

  TituloAccionLM = {
    L: '(Listado)',
    M: '(Modificación)',
  };

  // Mensajes para guiar al usuario.
  Mensajes = {
    SD: ' No se encontraron archivos existentes...',
    RD: ' Revisar los datos ingresados...',
  };

  // opciones del combo activo
  OpcionesActivo = [
    { Id: true, Nombre: 'SI' },
    { Id: false, Nombre: 'NO' },
  ];

  FormModificacion = new FormGroup({
    archivo: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
    ]),
    vistas: new FormControl(null, [
      Validators.required,
      Validators.pattern('[0-9]{1,7}'),
    ]),
    activo: new FormControl(),
  });

  constructor(
    private archivosService: ArchivosService,
    private modelDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.Buscar();
  }

  Buscar() {
    return this.GetArchivos();
  }

  GetArchivos() {
    this.archivosService.get().subscribe((res: Archivo[]) => {
      this.Archivos = res;
    });
  }

  BuscarPorId(id: number) {
    window.scroll(0, 0); // ir al incio del scroll

    this.archivosService.getById(id).subscribe((res: any) => {
      this.FormModificacion.patchValue(res);
      document.getElementById('idArchivo').innerHTML = res.id;
    });
  }

  Modificar(archivo: Archivo) {
    if (!archivo.activo) {
      this.modelDialogService.Alert(
        'No puede modificarse un archivo Inactivo.'
      );
      return;
    }
    this.FormModificacion.markAsUntouched();
    this.submitted = false;
    this.BuscarPorId(archivo.id);
    this.IdArchivoEnModificacion = archivo.id;
    this.AccionLM = 'M';
  }

  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormModificacion.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const archivoCopy = { ...this.FormModificacion.value };
    archivoCopy.id = this.IdArchivoEnModificacion;
    // modificar put
    this.archivosService.put(archivoCopy).subscribe((res: any) => {
      this.Cancelar();
      this.modelDialogService.Alert('Archivo modificado correctamente.');
      this.Buscar();
    });
  }

  Cancelar() {
    this.submitted = false;
    this.AccionLM = 'L';
    this.FormModificacion.reset();
  }
}
