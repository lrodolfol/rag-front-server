import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BaseComponent } from '../abstract/BaseComponent';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-start-free',
  templateUrl: './start-free.component.html',
  styleUrls: ['./start-free.component.css']
})
export class StartFreeComponent extends BaseComponent implements OnInit {
  signupData = {
    name: '',
    company: '',
    email: '',
    phone: ''
  };

  isSubmitting: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';
  uniqueCode: string = '';
  
  // Propriedades para funcionalidade de cópia
  isCodeCopied: boolean = false;

  private apiUrl = `${environment.urlApi}api/v1/register`;

  constructor(private http: HttpClient, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.resetForm();
  }

  onSubmit(): void {
    this.isError = false;
    this.isSuccess = false;
    this.errorMessage = '';

    if (!this.isValidForm()) {
      this.isError = true;
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.isSubmitting = true;

    const requestData = {
      name: this.signupData.name.trim(),
      company: this.signupData.company.trim(),
      email: this.signupData.email.trim(),
      phone: this.signupData.phone.trim(),
      trialType: 'free_14_days',
      timestamp: new Date().toISOString()
    };

    this.http.post<any>(this.apiUrl, requestData).subscribe({
      next: (response) => {
        console.log('Cadastro realizado com sucesso:', response);
        this.isSubmitting = false;
        this.isSuccess = true;
        this.uniqueCode = response.message;
      },
      error: (error) => {
        this.isSubmitting = false;
        this.isError = true;

        if (error.error && error.error.message) {
          console.error('Erro no cadastro - 1 ');
          this.errorMessage = `Oops, ${error.error.message}.`;
        } else if (error.message) {
          console.error('Erro no cadastro - 2 ');
          this.errorMessage = `Oops, Erro interno do servidor. Tente novamente mais tarde`;
        } else {
          this.errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        }
      }
    });
  }

  goToAuth(): void {
    this.router.navigate(['/auth']);
  }

  startNewSignup(): void {
    this.resetForm();
  }

  // Método para copiar código para clipboard
  async copyCodeToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.uniqueCode);
      this.isCodeCopied = true;
      
      // Remove o aviso após 2 segundos
      setTimeout(() => {
        this.isCodeCopied = false;
      }, 2000);
    } catch (err) {
      console.error('Erro ao copiar código:', err);
      
      // Fallback para navegadores que não suportam navigator.clipboard
      this.fallbackCopyTextToClipboard(this.uniqueCode);
    }
  }

  // Método fallback para cópia
  private fallbackCopyTextToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.isCodeCopied = true;
        setTimeout(() => {
          this.isCodeCopied = false;
        }, 2000);
      }
    } catch (err) {
      console.error('Fallback: Erro ao copiar texto: ', err);
    }

    document.body.removeChild(textArea);
  }

  isValidForm(): boolean {
    return !!(
      this.signupData.name && this.signupData.name.trim().length >= 2 &&
      this.signupData.company && this.signupData.company.trim().length >= 2 &&
      this.signupData.email && this.isValidEmail(this.signupData.email) &&
      this.signupData.phone && this.isValidPhone(this.signupData.phone)
    );
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  isValidPhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  }

  formatPhone(phone: string): string {
    if (!phone) return '';

    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2$3');
    } else if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '$1 $2 $3$4');
    }

    return phone;
  }

  onPhoneInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    this.signupData.phone = this.formatPhone(value);
    event.target.value = this.signupData.phone;
  }

  private resetForm(): void {
    this.signupData = {
      name: '',
      company: '',
      email: '',
      phone: ''
    };
    this.isSubmitting = false;
    this.isSuccess = false;
    this.isError = false;
    this.errorMessage = '';
    this.uniqueCode = '';
  }
}
