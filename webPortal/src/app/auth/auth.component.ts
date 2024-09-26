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

    public signIn() {
      this.isLoading = true;
      this._authService.signInUser(this.email, this.password)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
            this.isAuth = !this.isAuth
        },
        error: (err) => {
            console.log(err);
            this._matSnackBar.open('Error on login!', 'OK', { duration: 5000 });
        }
      })
    }

    public checkData() {
        this._matSnackBar.open(`Welcome, ${this._authService.user.firstName}`, 'OK', { duration: 5000 });
        this._navigationService.toMainPage();
    }

    public checkAuthState(): string {
        if(!this.isAuth) {
            return 'enter-button'
        }

        return 'auth-button'
    }
}
