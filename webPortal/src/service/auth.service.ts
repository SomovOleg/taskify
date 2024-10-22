import { Injectable } from '@angular/core';
import { UserInterface } from 'interfaces/user.interface';
import { Observable } from 'rxjs';
import { NavigationService } from './navigation.service';
import { HttpClient } from '@angular/common/http';
import { UserCredentials } from 'src/app/auth/auth.component';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    public get user() {
        return this._user;
    }

    public set user(userInfo: UserInterface) {
        this._user = userInfo;
    }

    constructor(private _http: HttpClient, private _navService: NavigationService) { }

    private _user: UserInterface;
    private _apiHost: string = 'http://localhost:5001';

    signInUser(userCredential: UserCredentials): Observable<any> {
        return this._http.post(`${this._apiHost}/login`, userCredential);
    }

    getUserInfo(userId: string): Observable<any> {
        return this._http.get(`${this._apiHost}/login/${userId}`);
    }
}
