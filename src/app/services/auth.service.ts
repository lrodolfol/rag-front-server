import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authenticated = false;
    private readonly AUTH_KEY = 'tnn_auth_token';

    constructor() {
        // Verifica se existe uma sessão salva no localStorage
        this.authenticated = !!localStorage.getItem(this.AUTH_KEY);
    }

    /**
     * Marca o usuário como autenticado
     */
    login(token: string): void {
        this.authenticated = true;
        localStorage.setItem(this.AUTH_KEY, token);
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
        const token = this.getToken();
        if (!token) {
            this.authenticated = false;
            return false;
        }

        if (this.isTokenExpired(token)) {
            this.logout();
            return false;
        }

        this.authenticated = true;
        return true;
    }

    private isTokenExpired(token: string): boolean {
        const payload = this.decodeToken(token);
        if (!payload || typeof payload['exp'] !== 'number') {
            return false;
        }

        return Date.now() >= payload['exp'] * 1000;
    }

    private decodeToken(token: string): Record<string, unknown> | null {
        const parts = token.split('.');
        if (parts.length < 2) {
            return null;
        }

        try {
            const base64 = parts[1]
                .replace(/-/g, '+')
                .replace(/_/g, '/');
            const decoded = atob(base64);
            return JSON.parse(decodeURIComponent(escape(decoded)));
        } catch {
            return null;
        }
    }

    /**
     * Limpa a sessão (útil para logout automático)
     */
    clearSession(): void {
        this.logout();
    }

    getToken(): string {
        return localStorage.getItem(this.AUTH_KEY) || '';
    }
}
