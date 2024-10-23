import { Routes } from "@angular/router";
import { ShellComponent } from "./shell/shell.component";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./guards/auth-guard";
import { UserGuard } from "./guards/user-guard";


export const APP_ROUTES: Routes = [
    { path: 'login', component: AuthComponent, canActivate: [UserGuard] },
    { path: 'main', component: ShellComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: '**', redirectTo: 'main' },
]
