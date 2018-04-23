import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Aux, AuxService } from '../+shared/_index';

declare var Materialize: any;

@Component({
    templateUrl: './aux-add.component.html'
})
export class AuxAddComponent {

    aux: Aux;
    loading = false;
    file: File = null;
    reader: FileReader;

    constructor(private router: Router, private route: ActivatedRoute, private service: AuxService) {
        this.aux = { nombre: null, cedula: null, celular: null, imagen: null, dispositivo: null };
        this.reader = new FileReader();
        this.reader.onload = this.loadedImg(this);
    }

    fileSelected(input: any) {
        this.file = input.target.files[0];
    }

    loadedImg(auxAdd: AuxAddComponent) {
        return function (e: any) {
            const image: string = e.target.result;
            const base: string[] = image.split(',');
            auxAdd.aux.imagen = base[1];
            auxAdd.service.insertAux(auxAdd.aux).subscribe(
                res => auxAdd.added(res),
                error => auxAdd.added([false, null, false])
            );
        }
    }

    add() {
        this.loading = true;
        this.aux.usuario = this.aux.cedula;
        if (this.file) {
            this.reader.readAsDataURL(this.file);
        } else {
            this.aux.imagen = null;
            this.service.insertAux(this.aux).subscribe(
                res => this.added(res),
                error => this.added([false, null, false])
            );
        }
    }

    added(res: [boolean, string, boolean]) {
        const [success, id, failImg] = res;
        this.loading = false;
        if (!success) {
            Materialize.toast(failImg ? 'Error al cargar imagen, intenta de nuevo' : 'Error al ingresar Auxiliar', 4000);
            return;
        }
        Materialize.toast('Operación Exitosa', 4000);
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}
