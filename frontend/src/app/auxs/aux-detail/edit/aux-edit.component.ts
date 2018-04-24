import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Aux, AuxService, AuxSelectedService } from '../../+shared/_index';

declare var Materialize: any;

@Component({
    selector: 'app-aux-edit',
    templateUrl: './aux-edit.component.html'
})
export class AuxEditComponent implements OnInit {

    @Output() finish = new EventEmitter<void>();

    loading: boolean;
    loadingPass: boolean;

    name: string;
    document: string;
    celNumber: string;
    device: string;
    tempPass: string;

    image: File = null;
    reader: FileReader;

    constructor(private service: AuxService, public selected: AuxSelectedService) {
        this.reader = new FileReader();
        this.reader.onload = this.loadedImg(this);
    }

    ngOnInit() {
        this.name = this.selected.aux.nombre;
        this.document = this.selected.aux.cedula;
        this.celNumber = this.selected.aux.celular;
        this.device = this.selected.aux.dispositivo;
        this.image = null;
        this.tempPass = '';
    }

    fileSelected(input: any) {
        this.image = input.target.files[0];
    }

    edit() {
        this.loading = true;
        if (this.image) {
            this.reader.readAsDataURL(this.image);
        } else {
            this.service.updateAux(this.selected.aux._id, this.name, this.document, this.celNumber, this.device, null, null)
                .subscribe(
                res => this.edited(res[0], res[1], res[2]),
                error => this.edited(false, false, null)
                );
        }
    }

    loadedImg(auxEdit: AuxEditComponent) {
        return function (e: any) {
            const image: string = e.target.result;
            const base: string[] = image.split(',');
            const imgPath: string[] = auxEdit.selected.aux.imagen.split('/');
            const imgName: string = imgPath[imgPath.length - 1];

            auxEdit.service.updateAux(auxEdit.selected.aux._id
                , auxEdit.name, auxEdit.document, auxEdit.celNumber, auxEdit.device, base[1], imgName
            ).subscribe(
                res => auxEdit.edited(res[0], res[1], res[2]),
                error => auxEdit.edited(false, false, null)
                );
        }
    }

    edited(success: boolean, failImg: boolean, urlImage: string) {
        this.loading = false;
        if (!success) {
            Materialize.toast(failImg ? 'Error al cargar la nueva imagen' : 'Error al editar auxiliar', 4000);
            return;
        }
        this.selected.aux.nombre = this.name;
        this.selected.aux.cedula = this.document;
        this.selected.aux.dispositivo = this.device;
        this.selected.aux.celular = this.celNumber;
        if (urlImage) {
            this.selected.aux.imagen = urlImage;
        }
        Materialize.toast('Auxiliar actualizado', 4000);
        this.finish.emit(null);
    }

    resetPass() {
        this.loadingPass = true;
        this.service.resetPass(this.selected.aux._id, this.tempPass)
            .subscribe(
            res => this.resetedPass(res),
            error => this.resetedPass(false)
            );
    }

    resetedPass(success: boolean) {
        this.loadingPass = false;
        if (!success) {
            Materialize.toast('Error al reiniciar password', 4000);
            return;
        }
        Materialize.toast('Contraseña reiniciada', 4000);
        this.finish.emit(null);
    }

}
