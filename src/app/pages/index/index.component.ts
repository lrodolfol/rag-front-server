import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, AfterViewInit {
  title: string = 'Ti Nos Negócios - ChatBot Empresarial';
  subtitle: string = 'Atendimento Inteligente 24/7';
  description: string = 'Respondendo dúvidas sobre sua empresa via WhatsApp automaticamente. Aumente seu alcance!';

  // Contact form properties
  contactData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  emailSent: boolean = false;
  emailError: boolean = false;
  isSubmittingEmail: boolean = false;


  private apiUrl = `${environment.urlApi}api/v1/contact`;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initializeBootstrap();
  }

  // Navigation methods
  navigateToSpotbotChat(): void {
    this.router.navigate(['/spotbot-chat-online']);
  }

  navigateToAuth(): void {
    this.router.navigate(['/auth']);
  }

  private initializeBootstrap(): void {
    if (typeof (window as any).bootstrap !== 'undefined') {
      console.log('Bootstrap JS carregado com sucesso');
    } else {
      console.warn('Bootstrap JS não encontrado');
      this.loadBootstrapJS();
    }
  }

  private loadBootstrapJS(): void {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
    script.onload = () => {
      console.log('Bootstrap JS carregado via CDN');
    };
    document.head.appendChild(script);
  }

  sendEmail(): void {
    this.emailSent = false;
    this.emailError = false;

    if (!this.isValidContactData()) {
      this.emailError = true;
      return;
    }

    this.isSubmittingEmail = true;

    const emailData = {
      name: this.contactData.name.trim(),
      email: this.contactData.email.trim(),
      phone: this.contactData.phone.trim(),
      message: `Novo cliente ${this.contactData.name.trim()}\n\n`,
      subject: `SpotBot - ${this.contactData.name}`
    };

    // Send email via API
    this.http.post(this.apiUrl, emailData).subscribe({
      next: (response) => {
        console.log('Email enviado com sucesso:', response);
        this.emailSent = true;
        this.emailError = false;
        this.resetContactForm();
        this.isSubmittingEmail = false;
      },
      error: (error) => {
        console.error('Erro ao enviar email:', error);
        this.emailError = true;
        this.emailSent = false;
        this.isSubmittingEmail = false;
        // setTimeout(() => {
        //   console.log('Simulando envio de email bem-sucedido (modo desenvolvimento)');
        //   this.emailSent = true;
        //   this.emailError = false;
        //   this.resetContactForm();
        // }, 2000);
      }
    });
  }

  isValidEmail(email: string): boolean {
    if (!email) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  isValidPhone(phone: string): boolean {
    if (!phone) return false;

    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');

    // Verifica se tem entre 10 e 11 dígitos (telefone brasileiro)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  }

  formatPhone(phone: string): string {
    if (!phone) return '';

    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');

    // Aplica a máscara conforme o formato: XX X XXXXXXXX ou XX X XXXXXXXXX
    if (cleanPhone.length === 10) {
      // Formato: XX XXXXXXXX
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2$3');
    } else if (cleanPhone.length === 11) {
      // Formato: XX X XXXXXXXX (com 9º dígito)
      return cleanPhone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '$1 $2 $3$4');
    }

    return phone; // Retorna original se não estiver no formato esperado
  }

  onPhoneInput(event: any): void {
    let value = event.target.value;

    // Remove todos os caracteres não numéricos
    value = value.replace(/\D/g, '');

    // Limita a 11 dígitos
    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    // Aplica a formatação
    this.contactData.phone = this.formatPhone(value);

    // Atualiza o campo
    event.target.value = this.contactData.phone;
  }

  private isValidContactData(): boolean {
    return !!(
      this.contactData.name &&
      this.contactData.name.trim().length >= 3 &&
      this.contactData.email &&
      this.isValidEmail(this.contactData.email) &&
      this.contactData.phone &&
      this.isValidPhone(this.contactData.phone) &&
      this.contactData.message &&
      this.contactData.message.trim().length >= 10
    );
  }

  private resetContactForm(): void {
    this.contactData = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
  }
}
