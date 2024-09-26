import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { docData, getFirestore } from '@angular/fire/firestore';
import { doc } from '@firebase/firestore';
import { UserInterface } from 'interfaces/user.interface';
import { Observable, from } from 'rxjs';
import { NavigationService } from './navigation.service';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    public get user() {
        return this._user;
    }

    constructor(private _firebaseAuth: Auth, private _navService: NavigationService) { }

    private _user: UserInterface;

    signInUser(email: string, password: string): Observable<void> {
        const promise = signInWithEmailAndPassword(this._firebaseAuth, email, password)
            .then((user) => {
                this.getUserInfo(user.user.uid).subscribe(userInfo => this._user = userInfo);
            });

        return from(promise);
    }

    getUserInfo(targetUid: string) {
        const db = getFirestore();
        const userRef = doc(db, 'Users', targetUid);
        return docData(userRef, { idField: 'uid' }) as Observable<UserInterface>;
    }
}
