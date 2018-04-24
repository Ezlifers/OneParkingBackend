import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Supervisor, SupervisorService, SupervisorSelectedService } from '../../+shared/_index';

declare var Materialize: any;

@Component({
    selector: 'app-supervisor-edit',
    templateUrl: './supervisor-edit.component.html'
})
export class SupervisorEditComponent implements OnInit {

    @Output() finish = new EventEmitter<void>();

    loading: boolean;
    loadingPass: boolean;

    name: string;
    document: string;
    celNumber: string;
    tempPass: string;

    image: File = null;
    reader: FileReader;

    constructor(private service: SupervisorService, public selected: SupervisorSelectedService) {
        this.reader = new FileReader();
        this.reader.onload = this.loadedImg(this);
    }

    ngOnInit() {
        this.name = this.selected.supervisor.nombre;
        this.document = this.selected.supervisor.cedula;
        this.celNumber = this.selected.supervisor.celular;
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
            this.service.updateSupervisor(this.selected.supervisor._id, this.name, this.document, this.celNumber, null, null)
                .subscribe(
                res => this.edited(res[0], res[1], res[2]),
                error => this.edited(false, false, null)
                );
        }
    }

    loadedImg(auxEdit: SupervisorEditComponent) {
        return function (e: any) {
            const image: string = e.target.result;
            const base: string[] = image.split(',');
            const imgPath: string[] = auxEdit.selected.supervisor.imagen.split('/');
            const imgName: string = imgPath[imgPath.length - 1];

            auxEdit.service.updateSupervisor(auxEdit.selected.supervisor._id
                , auxEdit.name, auxEdit.document, auxEdit.celNumber,  base[1], imgName
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
        this.selected.supervisor.nombre = this.name;
        this.selected.supervisor.cedula = this.document;
        this.selected.supervisor.celular = this.celNumber;
        if (urlImage) {
            this.selected.supervisor.imagen = urlImage;
        }
        Materialize.toast('Supervisor actualizado', 4000);
        this.finish.emit(null);
    }

    resetPass() {
        this.loadingPass = true;
        this.service.resetPass(this.selected.supervisor._id, this.tempPass)
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
