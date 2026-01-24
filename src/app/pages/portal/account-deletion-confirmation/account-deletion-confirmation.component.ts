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

  private apiUrl = `${environment.urlApi}api/v1/user_cancelled_account`;

  isSubmitting = false;
  alertMessage: string | null = null;

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

  confirmDeletion(): Observable<boolean> {
    // if (this.isSubmitting) {
    //   return;
    // }
    this.isSubmitting = true;
    this.alertMessage = null;
    console.log(this.apiUrl);
    return this.http.post<any>(this.apiUrl, "").pipe(
      map(response => {
        console.log('Resposta da API - ', response);
        if (!response || !response.message) {
          this.alertMessage = 'Sua conta foi excluida e todos os dados foram removidos. Obrigado por ter usado nossa plataforma.';
          return false;
        }

        return true;
      }),
      catchError(error => {
        console.error('Erro na API - ', error);
        this.alertMessage = 'Houve um erro ao processar sua solicitação. Tente novamente.';
        return of(false);
      })
    );
  }

  continueWithAccount(): void {
    this.router.navigate(['/portal']);
  }
}
