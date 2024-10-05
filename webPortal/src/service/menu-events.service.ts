import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuEventsService {
    private deskSource = new Subject<void>;
    desk$ = this.deskSource.asObservable();

    constructor() { }

    public deskRefresh() {
        this.deskSource.next();
    }
}
