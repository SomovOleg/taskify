import { Injectable } from '@angular/core';
import { UserInterface } from 'interfaces/user.interface';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserCredentials } from 'src/app/auth/auth.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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

    constructor(
        private _http: HttpClient,
        private _afAuth: AngularFireAuth
    ) { }

    private _user: UserInterface;
    private _apiHost: string = 'http://localhost:5001';

    checkUserCredentials(credentials: UserCredentials): Observable<any> {
        return from(this._afAuth.signInWithEmailAndPassword(credentials.email, credentials.password));
    }

    signInUser(userCredential: UserCredentials): Observable<any> {
        return this._http.post(`${this._apiHost}/login`, userCredential);
    }

    getUserInfo(userId: string): Observable<any> {
        return this._http.get(`${this._apiHost}/login/${userId}`);
    }
}
