import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { BaseComponent } from '../abstract/BaseComponent';
import { environment } from '../../../environments/environments';

interface FormData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-form-service',
  templateUrl: './form-service.component.html',
  styleUrls: ['./form-service.component.css']
})
export class FormServiceComponent extends BaseComponent implements OnInit {

  formData: FormData = {
    title: '',
    description: ''
  };

  isSubmitting = false;
  showSuccessMessage = false;
  countdown = 10;
  showTipsModal = false;

  private apiUrl = `${environment.urlApi}api/v1/services`;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
    }
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

    console.log(this.authService.getToken());

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
    this.startCountdown();
  }

  private handleError(): void {
    this.isSubmitting = false;
    alert('Erro ao enviar formulário. Tente novamente.');
  }

  private startCountdown(): void {
    const countdownInterval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(countdownInterval);
        this.logout();
        this.router.navigate(['/index']);
      }
    }, 1000);
  }

  clearForm(): void {
    this.formData = {
      title: '',
      description: ''
    };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  openTipsModal(): void {
    this.showTipsModal = true;
  }

  closeTipsModal(): void {
    this.showTipsModal = false;
  }
}
