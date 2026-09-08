import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { WalletPaymentFlowComponent } from '../../components/checkout/wallet-payment-flow/wallet-payment-flow.component';
import { Component, computed, inject, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, ArrowLeft, ChevronRight, BadgeCheck, CloudUpload, 
  FileCheck2, HandCoins, Info, Landmark, LockKeyhole, Map as MapIcon, 
  MapPin, PackageCheck, Phone, RotateCcw, ShieldCheck, Truck, UserRound, WalletCards 
} from 'lucide-angular';
import { CartService } from '../../../core/services/cart/cart.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HomeHeaderComponent } from '../../../shared/components/layout/home-header/home-header.component';


type TrackedOrderGender = 'COMMON.MENS' | 'COMMON.WOMENS' | 'COMMON.UNISEX';
type BankTransferReceipt = { name: string; type: string; dataUrl: string };
type WalletProvider = 'stc' | 'mada' | 'apple' | 'google';
interface WalletPaymentSession {
  orderId: string;
  orderNumber: string;
  createdAt: string;
  provider: WalletProvider;
  items: any[];
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

const WALLET_PROVIDER_LABELS: Record<WalletProvider, string> = {
  stc: 'STC Pay', mada: 'STOREFRONT.AUTO_STR_484', apple: 'Apple Pay', google: 'Google Pay'
};

const BANK_TRANSFER_DETAILS = {
  bankName: 'STOREFRONT.AUTO_STR_359',
  beneficiaryName: 'STOREFRONT.AUTO_STR_67',
  accountNumber: '123608010123456',
  iban: 'SA4480000123608010123456',
  transferNote: 'STOREFRONT.AUTO_STR_60',
};

const BANK_RECEIPT_MAX_SIZE = 5 * 1024 * 1024;
const BANK_RECEIPT_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const WALLET_PAYMENT_SESSION_KEY = 'lk-wallet-payment-session';
const ORDER_COUNTRY = 'SHARED.AUTO_STR_79';

const CHECKOUT_CITY_OPTIONS = ['STOREFRONT.AUTO_STR_449', 'STOREFRONT.AUTO_STR_485', 'STOREFRONT.AUTO_STR_450', 'CHECKOUT.CITY'];
const CHECKOUT_AREA_OPTIONS = ['STOREFRONT.AUTO_STR_474', 'STOREFRONT.AUTO_STR_475', 'STOREFRONT.AUTO_STR_486', 'STOREFRONT.AUTO_STR_487', 'STOREFRONT.AUTO_STR_488'];

function createTrackedOrderId() {
  return 'lxk_' + Math.random().toString(36).substring(2, 11);
}

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, WalletPaymentFlowComponent, CommonModule, RouterLink, FormsModule, LucideAngularModule, StoreLayoutComponent, HomeHeaderComponent, ],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {
  cartService = inject(CartService);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  CHECKOUT_CITY_OPTIONS = CHECKOUT_CITY_OPTIONS;
  CHECKOUT_AREA_OPTIONS = CHECKOUT_AREA_OPTIONS;
  BANK_TRANSFER_DETAILS = BANK_TRANSFER_DETAILS;

  config = {
    headerTitle: 'CART.CHECKOUT',
    headerSubtitle: 'STOREFRONT.AUTO_STR_118',
    emptyStateTitle: 'CART.EMPTY',
    emptyStateText: 'COMMON.CARTEMPTYDESC',
    emptyStateCta: 'STOREFRONT.AUTO_STR_415',
    customerInfoTitle: 'CHECKOUT.CUSTOMER_DETAILS',
    paymentInfoTitle: 'CHECKOUT.PAYMENT_METHOD',
    summaryTitle: 'CHECKOUT.ORDER_SUMMARY',
    showSafeShopping: true,
    safeShoppingTitle: 'CHECKOUT.SECURE_SHOPPING',
    safeShoppingText: 'STOREFRONT.AUTO_STR_47',
    showTrustBadges: true,
    trustBadges: [
      { id: '1', icon: 'BadgeCheck', title: 'CART.ORIGINAL_PRODUCTS', subtitle: 'CART.GUARANTEED_100' },
      { id: '2', icon: 'Truck', title: 'COMMON.FASTDELIVERY', subtitle: 'STOREFRONT.AUTO_STR_151' },
      { id: '3', icon: 'RotateCcw', title: 'STOREFRONT.AUTO_STR_274', subtitle: 'STOREFRONT.AUTO_STR_360' },
      { id: '4', icon: 'ShieldCheck', title: 'CART.SECURE_PAYMENT', subtitle: 'STOREFRONT.AUTO_STR_275' }
    ]
  };

  walletOptions = [
    { id: 'stc', label: 'STC Pay', image: '/assets/payment/stc-pay.png' },
    { id: 'mada', label: 'STOREFRONT.AUTO_STR_484', image: '/assets/payment/mada.png' },
    { id: 'apple', label: 'Apple Pay', image: '/assets/payment/apple-pay.png' },
    { id: 'google', label: 'Google Pay', image: '/assets/payment/google-pay.png' },
  ];

  cart = this.cartService.cart;
  
  displayItems = computed(() => {
    return this.cart().map((item: any) => ({
      cartItem: item,
      name: item.product?.nameAr || item.product?.name || 'STOREFRONT.AUTO_STR_471',
      image: item.product?.images?.[0] || '/assets/placeholder.png',
      price: item.product?.price || 0,
      color: 'STOREFRONT.AUTO_STR_472'
    }));
  });

  itemCount = computed(() => this.cart().reduce((sum: number, item: any) => sum + (item.quantity || 1), 0));
  subtotal = computed(() => this.displayItems().reduce((sum: number, item: any) => sum + item.price * item.cartItem.quantity, 0));
  shipping = computed(() => this.displayItems().length > 0 ? 20 : 0);
  discount = signal(0);
  total = computed(() => Math.max(0, this.subtotal() + this.shipping() - this.discount()));

  fullName = signal('');
  phone = signal('');
  country = signal(ORDER_COUNTRY);
  city = signal('');
  area = signal('');
  address = signal('');
  notes = signal('');
  paymentMethod = signal<'cod' | 'bank' | 'wallet'>('cod');
  bankReceipt = signal<File | null>(null);
  walletProvider = signal<WalletProvider>('stc');
  walletPaymentSession = signal<WalletPaymentSession | null>(null);

  isWalletPaymentFlow = signal(false);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isWalletPaymentFlow.set(params['payment'] === 'wallet');
      if (params['provider']) {
        this.walletProvider.set(params['provider'] as WalletProvider);
      }
    });

    const session = window.sessionStorage.getItem(WALLET_PAYMENT_SESSION_KEY);
    if (session) {
      this.walletPaymentSession.set(JSON.parse(session));
    }
  }

  handleBankReceipt(file: File | null) {
    if (!file) {
      this.bankReceipt.set(null);
      return;
    }
    if (!BANK_RECEIPT_TYPES.includes(file.type)) {
      this.toastService.showToast('STOREFRONT.AUTO_STR_163', 'error');
      return;
    }
    if (file.size > BANK_RECEIPT_MAX_SIZE) {
      this.toastService.showToast('STOREFRONT.AUTO_STR_61', 'info');
      return;
    }
    this.bankReceipt.set(file);
    this.toastService.showToast('STOREFRONT.AUTO_STR_152', 'success');
  }

  hasRequiredCheckoutData() {
    return Boolean(this.fullName().trim() && this.phone().trim() && this.address().trim());
  }

  startWalletPayment() {
    if (!this.hasRequiredCheckoutData()) {
      this.toastService.showToast('STOREFRONT.AUTO_STR_62', 'info');
      return;
    }
    const session: WalletPaymentSession = {
      orderId: createTrackedOrderId(),
      orderNumber: `LXK${Date.now().toString().slice(-9)}`,
      createdAt: new Date().toISOString(),
      provider: this.walletProvider(),
      items: this.displayItems(),
      subtotal: this.subtotal(),
      shipping: this.shipping(),
      discount: this.discount(),
      total: this.total(),
      customerName: this.fullName().trim(),
      phone: this.phone().trim(),
      city: this.city(),
      area: this.area(),
      address: this.address().trim(),
      notes: this.notes().trim(),
    };
    window.sessionStorage.setItem(WALLET_PAYMENT_SESSION_KEY, JSON.stringify(session));
    this.walletPaymentSession.set(session);
    this.router.navigate([], { queryParams: { payment: 'wallet', provider: this.walletProvider() } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async handleSubmit() {
    if (this.paymentMethod() === 'wallet') {
      this.startWalletPayment();
      return;
    }
    if (!this.hasRequiredCheckoutData()) {
      this.toastService.showToast('STOREFRONT.AUTO_STR_62', 'info');
      return;
    }
    if (this.paymentMethod() === 'bank' && !this.bankReceipt()) {
      this.toastService.showToast('STOREFRONT.AUTO_STR_69', 'info');
      return;
    }

    this.toastService.showToast('STOREFRONT.AUTO_STR_174', 'success');
    this.cartService.clearCart();
    this.router.navigate(['/orders']);
  }

  onBankReceiptChange(event: any) {
    const file = event.target.files?.[0] || null;
    this.handleBankReceipt(file);
  }

  onDropBankReceipt(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0] || null;
    this.handleBankReceipt(file);
  }

  onWalletBack() {
    this.router.navigate([], { queryParams: {} });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onWalletComplete() {
    this.cartService.clearCart();
    window.sessionStorage.removeItem(WALLET_PAYMENT_SESSION_KEY);
  }
}
