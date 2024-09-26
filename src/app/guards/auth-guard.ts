import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AuthService } from "src/service/auth.service";
import { NavigationService } from "src/service/navigation.service";

@Injectable()

export class AuthGuard implements CanActivate {

    constructor(private readonly _authService: AuthService, private readonly _navService: NavigationService) {}

    canActivate(): boolean {
            if(!this._authService.user) {
                this._navService.toAuthenticationPage();
                return false;
            }

        return true;
    }

}
