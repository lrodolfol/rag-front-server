import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { BasePortalComponent } from '../abstract';

interface FormData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-form-service',
  templateUrl: './form-service.component.html',
  styleUrls: ['./form-service.component.css']
})
export class FormServiceComponent extends BasePortalComponent implements OnInit {

  constructor(
    protected override authService: AuthService,
    protected override router: Router,
    protected override http: HttpClient
  ) {
    super(authService, router, http);
  }

  formData: FormData = {
    title: '',
    description: ''
  };

  isSubmitting = false;
  showSuccessMessage = false;
  showErrorMessage = false;
  showTipsModal = false;
  isLoading: boolean = false;

  private apiUrl = `${this.apiAddress}/services`;
  private getUserData = `${this.apiAddress}/user`;

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
    }

    this.getUserDataIfLogged();
  }

  getUserDataIfLogged(): void {
    this.isLoading = true;
    const headers = {
      'Authorization': `Bearer ${this.authService.getToken()}`
    }

    this.http.get(this.getUserData, { headers }).subscribe({
      next: (response) => {
        let company = response && (response as any).company;
        let description = response && (response as any).description;

        this.formData.title = company;
        this.formData.description = description;
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 401) {
          this.showErrorMessage = true;
          this.isLoading = false;
          this.logout();
          this.startCountdown(0, '/index');
        }

        if (error.status === 403) {
          this.showErrorMessage = true;
          this.isLoading = false;
          this.startCountdown(0, '/be-premium');
        }
      }
    });
  }

  submitForm(): void {
    if (!this.formData.title || !this.formData.description) {
      return;
    }

    this.isSubmitting = true;

    const payload = {
      title: this.formData.title,
      description: this.formData.description
    };

    const headers = {
      'Authorization': `Bearer ${this.authService.getToken()}`
    }

    this.http.post(this.apiUrl, payload, { headers }).subscribe({
      next: (response) => {
        console.log('Resposta da API - ', response);
        this.handleSuccess();
      },
      error: (error) => {
        console.error('Erro na API - ', error);
        this.handleError();
      }
    });
  }

  private handleSuccess(): void {
    this.isSubmitting = false;
    this.showSuccessMessage = true;
    this.startCountdown(10, '/portal');
  }

  private handleError(): void {
    this.isSubmitting = false;
    alert('Erro ao enviar formulário. Tente novamente.');
  }

  clearForm(): void {
    this.formData = {
      title: '',
      description: ''
    };
  }

  openTipsModal(): void {
    this.showTipsModal = true;
  }

  closeTipsModal(): void {
    this.showTipsModal = false;
  }

  goToMenu(): void {
    this.router.navigate(['/portal']);
  }
}
