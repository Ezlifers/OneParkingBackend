import { Component, Input } from '@angular/core';
import { User, SessionService } from '../../+core/_index';
import { ProfileService } from '../+shared/profile.service';


@Component({
    selector: 'app-profile-spec',
    templateUrl: './profile-spec.component.html'
})
export class ProfileSpecComponent {
    user: User;
    constructor(private session: SessionService, private service: ProfileService) {
        this.user = session.user;
    }
}
