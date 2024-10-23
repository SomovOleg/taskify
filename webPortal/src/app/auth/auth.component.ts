import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { NavigationService } from 'src/service/navigation.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
    public hide = true;
    public isLoading: boolean = false;
    public isAuth: boolean = true;

    public email: string = '';
    public password: string = '';


    constructor(
        private _authService: AuthService,
        private _navigationService: NavigationService,
        private _matSnackBar: MatSnackBar) {
    }

    public signInTest() {
        this.isLoading = !this.isLoading
        this._authService.checkUserCredentials(
            {
                email: this.email,
                password: this.password
            } as UserCredentials
        )
        .pipe(finalize(() => this.isLoading = !this.isLoading))
        .subscribe({
               next: (result) => {
                    this._authService.getUserInfo(result.user.uid).subscribe({
                        next: (userData) => {
                            this._authService.user = userData;
                            this._authService.user.uid = result.user.uid;
                            this.redirectToDesk();
                        },

                        error: () => {
                            this._matSnackBar.open(`Error on login!`, 'OK', { duration: 5000 });
                        }
                    })
               },

               error: () => {
                    this._matSnackBar.open(`User doesn't exist or password is incorrect`, 'OK', { duration: 5000 });
               }
        })
    }

    public redirectToDesk() {
        this._matSnackBar.open(`Welcome, ${this._authService.user.firstName}`, 'OK', { duration: 5000 });
        this._navigationService.toMainPage();
    }
}

export interface UserCredentials {
    email: string,
    password: string;
}
