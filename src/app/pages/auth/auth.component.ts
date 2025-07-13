import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../abstract/BaseComponent';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent extends BaseComponent implements OnInit {
  accessCode: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  private apiUrl = `${environment.urlApi}api/v1/validate-key`;
  private token = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {
    super();
  }

  ngOnInit(): void {
    // Se o usuário já estiver autenticado, redireciona para form-service
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/form-service']);
    }
  }

  validateCode(): void {
    if (!this.accessCode || this.accessCode.length < 8) {
      this.showError('Código deve conter pelo menos 8 caracteres');
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    // Simula uma validação no servidor
    setTimeout(() => {
      this.isValidCode(this.accessCode).subscribe(isValid => {
        if (isValid) {
          // Marca o usuário como autenticado
          this.authService.login(this.token);
          this.showSuccess('Código válido! Redirecionando...');
          setTimeout(() => {
            this.router.navigate(['/form-service']);
          }, 1500);
        } else {
          this.showError('Código de acesso inválido. Tente novamente.');
        }
      });
      this.isLoading = false;
    }, 1000);
  }

  private isValidCode(code: string): Observable<boolean> {
    const payload = { code: code };

    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(response => {
        console.log('Resposta da API - ', response);

        if (!response || !response.message) {
          this.showError('Resposta inválida do servidor. Tente novamente.');
          return false;
        }

        if (response.code !== 200) {
          this.showError('Código de acesso inválido. Tente novamente.');
          return false;
        }

        this.token = response.message;
        return true;
      }),
      catchError(error => {
        console.error('Erro na API - ', error);
        this.showError('Erro ao acessar o servidor.');
        return of(false);
      })
    );
  }

  isValidFormat(): boolean {
    if (!this.accessCode) return false;

    // Valida formato: 6-10 caracteres alfanuméricos
    const regex = /^[a-zA-Z0-9]{8,10}$/;
    return regex.test(this.accessCode);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';

    // Remove a mensagem após 5 segundos
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
