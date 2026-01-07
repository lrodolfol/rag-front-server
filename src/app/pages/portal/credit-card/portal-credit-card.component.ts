import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { BasePortalComponent } from '../abstract';

interface PaymentData {
  cardHolder: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  amount: number | null;
}

type SubmissionStatus = 'success' | 'error' | '';

@Component({
  selector: 'app-portal-credit-card',
  templateUrl: './portal-credit-card.component.html',
  styleUrls: ['./portal-credit-card.component.css']
})
export class PortalCreditCardComponent extends BasePortalComponent {
  paymentData: PaymentData = {
    cardHolder: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
    amount: null
  };

  submissionStatus: SubmissionStatus = '';
  submissionMessage = '';
  isSubmitting = false;
  formSubmitted = false;

  constructor(
    protected override authService: AuthService,
    protected override router: Router,
    protected override http: HttpClient
  ) {
    super(authService, router, http);
  }

  submitPayment(): void {
    this.submissionStatus = '';
    this.submissionMessage = '';
    this.formSubmitted = true;

    if (!this.isValidPaymentData()) {
      return;
    }

    this.isSubmitting = true;

    const payload = {
      cardHolderName: this.paymentData.cardHolder.trim(),
      cardNumber: (this.paymentData.cardNumber || '').replace(/\D/g, ''),
      expiration: this.paymentData.expiration.trim(),
      cvv: this.paymentData.cvv.trim(),
      amount: Number(this.paymentData.amount)
    };

    const headers = {
      Authorization: `Bearer ${this.authService.getToken()}`
    };

    this.http.post(`${this.apiAddress}/payments/credit-card`, payload, { headers }).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.formSubmitted = false;
        this.submissionStatus = 'success';
        this.submissionMessage = (response as any)?.message || 'Sucesso! O backend respondeu 200, deu tudo certo.';
        this.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.submissionStatus = 'error';
        const fallback = 'Não foi possível processar o pagamento. Tente novamente.';
        this.submissionMessage = error?.error?.error || error?.error?.message || fallback;
      }
    });
  }

  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    const formatted = groups ? groups.join(' ') : digits;
    input.value = formatted;
    this.paymentData.cardNumber = formatted;
  }

  onExpirationInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '').slice(0, 4);

    if (digits.length > 2) {
      digits = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    input.value = digits;
    this.paymentData.expiration = digits;
  }

  private isValidPaymentData(): boolean {
    const holderValid = !!this.paymentData.cardHolder.trim();
    const expirationValid = this.isExpirationValid();
    const cvvValid = this.isCvvValid();
    const amountValid = this.isAmountValid();

    return (
      holderValid &&
      this.isCardNumberValid() &&
      expirationValid &&
      cvvValid &&
      amountValid
    );
  }

  isCardNumberValid(): boolean {
    const digits = (this.paymentData.cardNumber || '').replace(/\D/g, '');
    return digits.length >= 12 && digits.length <= 16;
  }

  isExpirationValid(): boolean {
    return /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(this.paymentData.expiration.trim());
  }

  isCvvValid(): boolean {
    return /^[0-9]{3,4}$/.test(this.paymentData.cvv.trim());
  }

  isAmountValid(): boolean {
    return !!(this.paymentData.amount && this.paymentData.amount > 0);
  }

  private resetForm(): void {
    this.paymentData = {
      cardHolder: '',
      cardNumber: '',
      expiration: '',
      cvv: '',
      amount: null
    };
  }
}
