import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User, SessionService } from '../../+core/_index';
import { ProfileService } from '../+shared/profile.service';

declare var Materialize: any;

@Component({
    selector: 'app-profile-edit',
    templateUrl: './profile-edit.component.html'
})
export class ProfileEditComponent implements OnInit {

    @Output() finish = new EventEmitter<void>();

    loading: boolean;
    loadingPass: boolean;

    name: string;
    document: string;
    celNumber: string;

    newPass: string;

    image: File = null;
    reader: FileReader;

    constructor(private service: ProfileService, private session: SessionService) {
        this.reader = new FileReader();
        this.reader.onload = this.loadedImg(this);
    }

    ngOnInit() {
        this.name = this.session.user.nombre;
        this.document = this.session.user.cedula;
        this.celNumber = this.session.user.celular;

        this.image = null;
        this.newPass = '';
    }

    fileSelected(input: any) {
        this.image = input.target.files[0];
    }

    edit() {
        this.loading = true;
        if (this.image) {
            this.reader.readAsDataURL(this.image);
        } else {
            this.service.updateUser(this.session.id, this.name, this.document, this.celNumber, null, null)
                .subscribe(
                res => this.edited(res[0], res[1], res[2]),
                error => this.edited(false, false, null)
                );
        }
    }

    loadedImg(profileEdit: ProfileEditComponent) {
        return function (e: any) {
            const image: string = e.target.result;
            const base: string[] = image.split(',');
            const imgPath: string[] = profileEdit.session.user.imagen.split('/');
            const imgName: string = imgPath[imgPath.length - 1];

            profileEdit.service.updateUser(profileEdit.session.id,
                profileEdit.name, profileEdit.document, profileEdit.celNumber, base[1], imgName
            ).subscribe(
                res => profileEdit.edited(res[0], res[1], res[2]),
                error => profileEdit.edited(false, false, null)
                );
        };
    }

    edited(success: boolean, failImg: boolean, urlImage: string) {
        this.loading = false;

        if (!success) {
            Materialize.toast(failImg ? 'Error al cargar la nueva imagen' : 'Error al editar usuario', 4000);
            return;
        }

        this.session.user.nombre = this.name;
        this.session.user.cedula = this.document;
        this.session.user.celular = this.celNumber;
        if (urlImage) {
            this.session.user.imagen = urlImage;
        }
        Materialize.toast('Usuario actualizado', 4000);
        this.finish.emit(null);
    }

    resetPass() {
        this.loadingPass = true;
        this.service.updatePass(this.session.id, this.newPass)
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
        Materialize.toast('Contraseña reiniciada ', 4000);
        this.finish.emit(null);
    }
}
