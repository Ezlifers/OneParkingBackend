import { Injectable } from '@angular/core';
import { Supervisor } from './supervisor.model';

@Injectable()
export class SupervisorSelectedService {
    public supervisor: Supervisor;
}
