import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { BasePortalComponent } from '../abstract';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environments';

interface DeletionDetail {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-account-deletion-confirmation',
  templateUrl: './account-deletion-confirmation.component.html',
  styleUrls: ['./account-deletion-confirmation.component.css']
})
export class AccountDeletionConfirmationComponent extends BasePortalComponent implements OnInit {
  consequences: DeletionDetail[] = [
    {
      icon: 'bi-eraser-fill text-danger',
      title: 'Dados apagados imediatamente',
      description: 'Todo historico de empresas, respostas e mensagens e removido da nossa base assim que a acao e confirmada.'
    },
    {
      icon: 'bi-person-dash-fill text-primary',
      title: 'Perfil sumira da busca',
      description: 'Clientes e parceiros nao terao mais como encontrar sua empresa ou conta usando nossas ferramentas.'
    },
    {
      icon: 'bi-shield-lock-fill text-warning',
      title: 'Sem reversao',
      description: 'A exclusao e definitiva e nao ha recuperacao automatica; guarde qualquer informacao importante antes de seguir.'
    }
  ];

  private apiUrl = `${environment.urlApi}api/v1/user-cancelled-account`;

  isSubmitting = false;
  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | null = null;
  private redirectCountdown = 3;
  private redirectTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    protected override authService: AuthService,
    protected override router: Router,
    protected override http: HttpClient
  ) {
    super(authService, router, http);
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
    }
  }

  confirmDeletion(): void {
    // if (this.isSubmitting) {
    //   return;
    // }
    this.isSubmitting = true;
    this.alertMessage = null;

    const headers = {
      'Authorization': `Bearer ${this.authService.getToken()}`
    }

    this.http.post<any>(this.apiUrl, "", { headers }).subscribe({
      next: (response) => {
        this.alertMessage = 'Sua conta foi excluída com sucesso. Obrigado por ter usado nossa plataforma.';
        this.alertType = 'success';
        this.isSubmitting = false;
        this.authService.logout();
        this.startRedirectCountdown();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.alertType = 'danger';

        if (error.error && error.error.message) {
          this.alertMessage = `Oops, ${error.error.message}.`;
        } else if (error.message) {
          this.alertMessage = `Oops, Erro interno do servidor. Tente novamente mais tarde`;
        } else {
          this.alertMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        }
      }
    });
  }

  continueWithAccount(): void {
    this.router.navigate(['/portal']);
  }

  get alertClass(): string {
    return this.alertType ? `alert alert-${this.alertType}` : 'alert alert-info';
  }

  private startRedirectCountdown(): void {
    if (this.redirectTimer) {
      clearInterval(this.redirectTimer);
    }

    this.redirectCountdown = 3;
    this.updateRedirectMessage();
    this.redirectTimer = setInterval(() => {
      this.redirectCountdown -= 1;

      if (this.redirectCountdown <= 0) {
        clearInterval(this.redirectTimer as ReturnType<typeof setInterval>);
        this.router.navigate(['/']);
        return;
      }

      this.updateRedirectMessage();
    }, 1000);
  }

  private updateRedirectMessage(): void {
    this.alertMessage = `Sua conta foi excluída com sucesso. Você será redirecionado em ${this.redirectCountdown} segundos.`;
  }
}
