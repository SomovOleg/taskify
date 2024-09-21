import { Routes } from "@angular/router";
import { ShellComponent } from "./shell/shell.component";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./guards/auth-guard";


export const APP_ROUTES: Routes = [
    { path: 'login', component: AuthComponent },
    { path: 'main', component: ShellComponent },
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: '**', redirectTo: 'main' },
]
