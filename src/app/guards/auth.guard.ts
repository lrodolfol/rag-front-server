import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    router = inject(Router);
    authService = inject(AuthService);
    canActivate(): boolean {
        const isAuthenticated = this.authService.isAuthenticated();

        if (isAuthenticated) {
            return true;
        } else {
            // Redireciona para a tela de auth se não estiver autenticado
            this.router.navigate(['/auth']);
            return false;
        }
    }
}
