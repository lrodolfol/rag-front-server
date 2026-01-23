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
  showResetOverlay = false;
  resetEmail = '';
  resetLoading = false;
  resetFeedback = '';

  private apiUrl = `${environment.urlApi}api/v1/validate-key`;
  private apiUrlRecovery = `${environment.urlApi}api/v1/password-recovery`;

  private token = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/portal']);
    }
  }

  validateCode(): void {
    if (!this.accessCode || this.accessCode.length < 8) {
      this.showError('Código inválido.');
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    setTimeout(() => {
      this.isValidCode(this.accessCode).subscribe(isValid => {
        if (isValid) {
          // Marca o usuário como autenticado
          this.authService.login(this.token);
          this.showSuccess('Código válido! Redirecionando...');
          setTimeout(() => {
            this.router.navigate(['/portal']);
          }, 1500);
        }
      });
      this.isLoading = false;
    }, 1000);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  toggleResetOverlay(event?: Event): void {
    event?.preventDefault();
    this.showResetOverlay = !this.showResetOverlay;

    if (this.showResetOverlay) {
      this.resetFeedback = '';
      this.resetLoading = false;
    } else {
      this.resetEmail = '';
      this.resetFeedback = '';
      this.resetLoading = false;
    }
  }

  sendResetEmail(): void {
    if (!this.isValidEmail(this.resetEmail)) {
      this.resetFeedback = 'Informe um e-mail válido.';
      return;
    }

    this.resetLoading = true;
    this.resetFeedback = '';

    const payload = { email: this.resetEmail };
    this.http.post(this.apiUrlRecovery, payload).subscribe({
      next: (response) => {
        this.resetFeedback = 'Se o e-mail estiver cadastrado, um novo código de acesso foi enviado.';
        this.resetLoading = false;
      },
      error: (error) => {
        console.error('Erro na API - ', error);
        this.resetFeedback = 'Erro ao enviar o novo código. Tente novamente.';
        this.resetLoading = false;
      }
    });
  }

  private isValidCode(code: string): Observable<boolean> {
    const payload = { code: code };

    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(response => {
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
        this.showError('Houve um erro ao processar sua solicitação. Tente novamente.');
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

  isValidEmail(email: string): boolean {
    if (!email) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
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
