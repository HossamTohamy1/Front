import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

export type WalletPaymentProvider = 'apple-pay' | 'stc-pay' | 'visa' | 'mastercard' | 'mada';
export type WalletPaymentStep = 1 | 2 | 3;

export interface WalletPaymentItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface WalletPaymentSession {
  orderId: string;
  orderNumber: string;
  createdAt: string;
  provider: WalletPaymentProvider | string;
  items: WalletPaymentItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  customerName: string;
  phone: string;
  city: string;
  area: string;
  address: string;
  notes: string;
}

type CardFieldName = 'cardNumber' | 'expiryDate' | 'cvv' | 'cardholderName';
type TouchedFields = Record<CardFieldName, boolean>;
type FieldErrors = Partial<Record<CardFieldName, string>>;

const INITIAL_TOUCHED_FIELDS: TouchedFields = {
  cardNumber: false,
  expiryDate: false,
  cvv: false,
  cardholderName: false,
};

const WALLET_PROVIDER_LABELS: Record<WalletPaymentProvider, string> = {
  'apple-pay': 'Apple Pay',
  'stc-pay': 'STC Pay',
  'visa': 'Visa',
  'mastercard': 'Mastercard',
  'mada': 'Mada',
};

const WALLET_PROVIDER_LOGOS: Record<WalletPaymentProvider, string> = {
  'apple-pay': 'assets/images/payment/apple-pay-logo.svg',
  'stc-pay': 'assets/images/payment/stc-pay-logo.svg',
  'visa': 'assets/images/payment/visa-logo.svg',
  'mastercard': 'assets/images/payment/mastercard-logo.svg',
  'mada': 'assets/images/payment/mada-logo.svg',
};

function passesLuhnCheck(val: string): boolean {
  if (!val || /\D/.test(val) || val.length < 13 || val.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = val.length - 1; i >= 0; i--) {
    let digit = parseInt(val.charAt(i), 10);
    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function isExpiryValid(val: string): boolean {
  const digits = val.replace(/\D/g, '');
  if (digits.length !== 4) return false;
  const month = parseInt(digits.slice(0, 2), 10);
  const year = parseInt(digits.slice(2, 4), 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const currentYear = parseInt(now.getFullYear().toString().slice(-2), 10);
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

function saveTrackedOrder(data: any) {
}

@Component({
  selector: 'app-wallet-payment-flow',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './wallet-payment-flow.component.html',
  styles: [':host { display: block; }']
})
export class WalletPaymentFlowComponent implements OnInit, OnDestroy {
  @Input() session: any;
  @Output() onBack = new EventEmitter<void>();
  @Output() onComplete = new EventEmitter<void>();

  private router = inject(Router);

  step: WalletPaymentStep = 1;
  maxUnlockedStep: WalletPaymentStep = 1;
  flashingStep: WalletPaymentStep | null = null;
  
  cardNumber = '';
  expiryDate = '';
  cvv = '';
  cardholderName = '';
  
  sameBillingAddress = true;
  showDifferentBilling = false;
  
  touchedFields: TouchedFields = { ...INITIAL_TOUCHED_FIELDS };
  submitAttempted = false;
  paymentError = false;
  processingComplete = false;
  paymentSaved = false;

  private processingTimer: any;

  get providerLabel() { return WALLET_PROVIDER_LABELS[(this.session?.provider || 'visa') as WalletPaymentProvider]; }
  get providerLogo() { return WALLET_PROVIDER_LOGOS[(this.session?.provider || 'visa') as WalletPaymentProvider]; }
  get lastFourDigits() { return this.cardNumber.replace(/\D/g, '').slice(-4).padStart(4, '****'); }
  get cartItemCount() { return this.session!.items.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0; }

  get validationErrors(): FieldErrors {
    const errors: FieldErrors = {};
    const cardDigits = this.cardNumber.replace(/\D/g, '');
    const cvvDigits = this.cvv.replace(/\D/g, '');
    const normalizedName = this.cardholderName.trim();

    if (!passesLuhnCheck(cardDigits)) {
        errors.cardNumber = 'Ø±Ù‚Ù… Ø§Ù„Ø¨Ø·Ø§Ù‚Ø© ØºÙŠØ± ØµØ­ÙŠØ­.';
    }

    if (!isExpiryValid(this.expiryDate)) {
        errors.expiryDate = 'ØªØ§Ø±ÙŠØ® Ø§Ù„Ø§Ù†ØªÙ‡Ø§Ø¡ ØºÙŠØ± ØµØ­ÙŠØ­.';
    }

    if (!/^\\d{3,4}$/.test(cvvDigits)) {
        errors.cvv = 'Ø±Ù…Ø² Ø§Ù„Ù€ CVV ØºÙŠØ± ØµØ­ÙŠØ­.';
    }

    if (normalizedName.length < 3 || /\\d/.test(normalizedName)) {
        errors.cardholderName = 'ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø§Ù„Ø§Ø³Ù… ÙƒØ§Ù…Ù„Ø§Ù‹.';
    }

    return errors;
  }

  get formIsValid() { return Object.keys(this.validationErrors).length === 0; }

  get orderDate() {
    if(!(this.session!.createdAt || '')) return '';
    return new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date((this.session!.createdAt || '')));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.processingTimer) clearTimeout(this.processingTimer);
  }

  startProcessing() {
    this.processingComplete = false;
    if (this.processingTimer) clearTimeout(this.processingTimer);
    this.processingTimer = setTimeout(() => {
      this.processingComplete = true;
      this.maxUnlockedStep = 3;
      this.flashingStep = 3;
    }, 2300);
  }

  onCardNumberChange(event: any) {
    const value = event.target.value || '';
    const digits = value.replace(/\D/g, '').slice(0, 16);
    this.cardNumber = digits.replace(/(\\d{4})(?=\\d)/g, '$1 ');
  }

  onExpiryChange(event: any) {
    const value = event.target.value || '';
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length < 3) this.expiryDate = digits;
    else this.expiryDate = `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  }

  onCvvChange(event: any) {
    const value = event.target.value || '';
    this.cvv = value.replace(/\D/g, '').slice(0, 4);
  }

  markTouched(field: CardFieldName) {
    this.touchedFields = { ...this.touchedFields, [field]: true };
  }

  shouldShowError(field: CardFieldName) {
    return Boolean((this.submitAttempted || this.touchedFields[field]) && this.validationErrors[field]);
  }

  shouldShowValid(field: CardFieldName) {
    const val = (this as any)[field];
    return Boolean(val.trim() && !this.validationErrors[field]);
  }

  getFieldClass(field: CardFieldName) {
    if (this.shouldShowError(field)) return 'is-invalid';
    if (this.shouldShowValid(field)) return 'is-valid';
    return '';
  }

  scrollToSteps() {
    setTimeout(() => {
      document.querySelector('.lk-wallet-flow-steps')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }

  handlePaymentSubmit(event: Event) {
    event.preventDefault();
    this.submitAttempted = true;
    this.touchedFields = {
      cardNumber: true,
      expiryDate: true,
      cvv: true,
      cardholderName: true,
    };

    if (!this.formIsValid) {
      this.paymentError = true;
      this.maxUnlockedStep = 1;
      this.flashingStep = null;
      setTimeout(() => {
        document.querySelector('.lk-wallet-validation-alert')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }

    this.paymentError = false;
    this.maxUnlockedStep = 2;
    this.flashingStep = 2;
    this.step = 2;
    this.scrollToSteps();
    this.startProcessing();
  }

  savePaymentOrder() {
    if (this.paymentSaved) return;

    const estimatedDate = new Date((this.session!.createdAt || ''));
    estimatedDate.setDate(estimatedDate.getDate() + 4);

    saveTrackedOrder({
      id: this.session!.orderId,
      orderNumber: this.session!.orderNumber,
      createdAt: (this.session!.createdAt || ''),
      updatedAt: new Date().toISOString(),
      status: 'confirmed',
      items: this.session!.items,
      subtotal: this.session!.subtotal,
      shipping: this.session!.shipping,
      discount: this.session!.discount,
      total: this.session!.total,
      customerName: this.session!.customerName,
      phone: this.session!.phone,
      city: this.session!.city,
      area: this.session!.area,
      address: this.session!.address,
      notes: this.session!.notes,
      paymentMethod: `Ø¨Ø·Ø§Ù‚Ø© Ø§Ø¦ØªÙ…Ø§Ù†ÙŠØ© - ${this.providerLabel}`,
      estimatedDelivery: new Intl.DateTimeFormat('ar-EG', {
        day: 'numeric',
        month: 'long',
      }).format(estimatedDate),
      country: 'SHARED.AUTO_STR_79',
      deliveryCompany: 'DASHBOARD.AUTO_STR_456'
    });

    this.paymentSaved = true;
    this.onComplete.emit();
  }

  handleStepClick(nextStep: WalletPaymentStep) {
    if (nextStep > this.maxUnlockedStep) return;

    if (nextStep === 3) {
      this.savePaymentOrder();
    }

    this.step = nextStep;
    if (this.flashingStep === nextStep) this.flashingStep = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  downloadInvoice() {
    const invoice = [
      `LOXX KING - ÙØ§ØªÙˆØ±Ø© Ø§Ù„Ø·Ù„Ø¨ ${this.session!.orderNumber}`,
      `Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø¯ÙØ¹: ${this.providerLabel}`,
      `ØªØ§Ø±ÙŠØ® Ø§Ù„Ø·Ù„Ø¨: ${this.orderDate}`,
      `Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹ Ø§Ù„ÙØ±Ø¹ÙŠ: ${this.session!.subtotal} Ø±.Ø³`,
      `ØªÙƒÙ„ÙØ© Ø§Ù„ØªÙˆØµÙŠÙ„: ${this.session!.shipping} Ø±.Ø³`,
      `Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠ: ${this.session!.total} Ø±.Ø³`,
    ].join('\\n');

    const blob = new Blob([invoice], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.session!.orderNumber}-invoice.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  printInvoice() {
    window.print();
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
