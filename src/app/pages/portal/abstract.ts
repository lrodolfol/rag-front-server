import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { environment } from '../../../environments/environments';

export class BasePortalComponent {
    protected apiAddress = `${environment.urlApi}api/v1`;

    constructor(
        protected authService: AuthService,
        protected router: Router,
        protected http: HttpClient
    ) {}

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/auth']);
    }

}
