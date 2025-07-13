import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authenticated = false;
    private readonly AUTH_KEY = 'tnn_auth_token';

    constructor() {
        // Verifica se existe uma sessão salva no localStorage
        this.authenticated = localStorage.getItem(this.AUTH_KEY) === 'true';
    }

    /**
     * Marca o usuário como autenticado
     */
    login(token: string): void {
        this.authenticated = true;
        localStorage.setItem(this.AUTH_KEY, token,);
    }

    /**
     * Remove a autenticação do usuário
     */
    logout(): void {
        this.authenticated = false;
        localStorage.removeItem(this.AUTH_KEY);
    }

    /**
     * Verifica se o usuário está autenticado
     */
    isAuthenticated(): boolean {
        return this.authenticated;
    }

    /**
     * Limpa a sessão (útil para logout automático)
     */
    clearSession(): void {
        this.logout();
    }

    getToken(): string {
        if(this.authenticated = true){
            return localStorage.getItem(this.AUTH_KEY) || '';
        }
        return '';
    }
}
