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
    ) {
        this.validateTokenApi();
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/auth']);
    }

    validateTokenApi(): void {
        const token = this.authService.getToken();
        if (!token) {
            this.logout();
            return;
        }
        
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        this.http.get(`${this.apiAddress}/validate-token`, { headers }).subscribe({
            next: () => {
            },
            error: () => {
                this.logout();
            }
        });
    }
}
