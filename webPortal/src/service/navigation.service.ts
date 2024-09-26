import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    constructor(private _router: Router) { }

    public toAuthenticationPage() {
        this._router.navigateByUrl('login');
    }

    public toMainPage() {
        this._router.navigateByUrl('main');
    }
}
