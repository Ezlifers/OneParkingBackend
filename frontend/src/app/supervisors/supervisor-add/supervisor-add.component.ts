import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Supervisor, SupervisorService } from '../+shared/_index';

declare var Materialize: any;

@Component({
    templateUrl: './supervisor-add.component.html'
})
export class SupervisorAddComponent {

    supervisor: Supervisor;
    loading = false;
    file: File = null;
    reader: FileReader;

    constructor(private router: Router, private route: ActivatedRoute, private service: SupervisorService) {
        this.supervisor = { nombre: null, cedula: null, celular: null, imagen: null };
        this.reader = new FileReader();
        this.reader.onload = this.loadedImg(this);
    }

    fileSelected(input: any) {
        this.file = input.target.files[0];
    }

    loadedImg(supervisorAdd: SupervisorAddComponent) {
        return function (e: any) {
            const image: string = e.target.result;
            const base: string[] = image.split(',');
            supervisorAdd.supervisor.imagen = base[1];
            supervisorAdd.service.insertSupervisor(supervisorAdd.supervisor).subscribe(
                res => supervisorAdd.added(res),
                error => supervisorAdd.added([false, null, false])
            );
        }
    }

    add() {
        this.loading = true;
        this.supervisor.usuario = this.supervisor.cedula;
        if (this.file) {
            this.reader.readAsDataURL(this.file);
        } else {
            this.supervisor.imagen = null;
            this.service.insertSupervisor(this.supervisor).subscribe(
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
