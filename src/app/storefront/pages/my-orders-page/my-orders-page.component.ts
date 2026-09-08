import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ArrowLeft,
  Bike,
  Box,
  Check,
  ChevronRight,
  FileText,
  MessageCircle,
  PackageSearch,
  Phone,
  ShoppingBag,
  Truck,
  LucideAngularModule
} from 'lucide-angular';
import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';

export type TrackedOrderStatus = 'confirmed' | 'preparing' | 'shipped' | 'out-for-delivery' | 'delivered';

export interface TrackedOrderItem {
  name: string;
  size: string;
  color: string;
  image: string;
}

export interface TrackedOrder {
  orderNumber: string;
  phone: string;
  status: TrackedOrderStatus;
  updatedAt: string;
  items: TrackedOrderItem[];
}

@Component({
  selector: 'app-my-orders-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, 
    CommonModule,
    FormsModule,
    RouterModule,
    LucideAngularModule,
    StoreLayoutComponent
  ],
  templateUrl: './my-orders-page.component.html'
})
export class MyOrdersPageComponent implements OnInit {
  config = {
    emptyTitle: 'STOREFRONT.AUTO_STR_175',
    emptyText: 'STOREFRONT.AUTO_STR_83',
    emptyCta: 'STOREFRONT.AUTO_STR_415',
    notFoundTitle: 'DASHBOARD.AUTO_STR_50',
    notFoundText: 'STOREFRONT.AUTO_STR_37',
    showSupportCard: true,
    supportTitle: 'STOREFRONT.AUTO_STR_305',
    supportText: 'STOREFRONT.AUTO_STR_186',
    headerTitle: 'STOREFRONT.AUTO_STR_336',
    headerSubtitle: 'STOREFRONT.AUTO_STR_120',
    phonePlaceholder: 'CHECKOUT.PHONE',
    orderPlaceholder: 'ORDERS.ORDER_NUMBER',
    buttonText: 'STOREFRONT.AUTO_STR_397',
  };

  orders = signal<TrackedOrder[]>([]);
  phone = signal('');
  orderNumber = signal('');
  hasSearched = signal(false);

  trackingSteps = [
    { key: 'confirmed', label: 'STOREFRONT.AUTO_STR_398', icon: Check },
    { key: 'preparing', label: 'DASHBOARD.AUTO_STR_306', icon: Box },
    { key: 'shipped', label: 'COMMON.SHIPPED', icon: Truck },
    { key: 'out-for-delivery', label: 'STOREFRONT.AUTO_STR_367', icon: Bike },
    { key: 'delivered', label: 'DASHBOARD.AUTO_STR_341', icon: Check },
  ];


  trackingStepOrder = this.trackingSteps.map(step => step.key);

  latestOrder = computed(() => this.orders()[0] ?? null);

  foundOrder = computed(() => {
    const phoneDigits = this.normalizeDigits(this.phone());
    const orderDigits = this.normalizeDigits(this.orderNumber());

    if (!phoneDigits && !orderDigits) {
      return this.latestOrder();
    }

    return this.orders().find(order => {
      const matchesPhone = phoneDigits ? this.normalizeDigits(order.phone).includes(phoneDigits) : true;
      const matchesOrder = orderDigits ? this.getDisplayOrderNumber(order.orderNumber).includes(orderDigits) : true;
      return matchesPhone && matchesOrder;
    }) ?? null;
  });

  showEmptyState = computed(() => this.orders().length === 0);
  
  showNotFound = computed(() => 
    !this.showEmptyState() && this.hasSearched() && !this.foundOrder()
  );

  ngOnInit() {
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    this.hasSearched.set(true);
  }

  normalizeDigits(value: string): string {
    return value.replace(/\D/g, '');
  }

  getDisplayOrderNumber(value: string): string {
    const digits = this.normalizeDigits(value);
    return digits || value;
  }

  formatRelativeUpdate(updatedAt: string): string {
    const timestamp = new Date(updatedAt).getTime();

    if (Number.isNaN(timestamp)) {
      return 'STOREFRONT.AUTO_STR_187';
    }

    const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));

    if (minutes < 60) {
      return `Ø¢Ø®Ø± ØªØ­Ø¯ÙŠØ« Ù…Ù†Ø° ${minutes} ${minutes === 1 ? 'STOREFRONT.AUTO_STR_459' : 'STOREFRONT.AUTO_STR_460'}`;
    }

    const hours = Math.max(1, Math.round(minutes / 60));

    return `Ø¢Ø®Ø± ØªØ­Ø¯ÙŠØ« Ù…Ù†Ø° ${hours} ${hours === 1 ? 'STOREFRONT.AUTO_STR_476' : 'STOREFRONT.AUTO_STR_461'}`;
  }

  getCurrentIndex(status: TrackedOrderStatus | undefined): number {
    if (!status) return 0;
    return Math.max(0, this.trackingStepOrder.indexOf(status));
  }
}
