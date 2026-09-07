import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Banknote,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  PackageCheck,
  Percent,
  ReceiptText,
  ShoppingBag,
  Truck,
  Wallet
} from 'lucide-angular';
import { AdminLayoutComponent } from '../../../shared/components/layout/admin-layout/admin-layout.component';
import { OrderService } from '../../../core/services/order/order.service';
import { TrackedOrder } from '../../../core/models/order.model';

const TRY_PER_USD = 40;

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildDayWindow(dateValue: string): { start: Date; end: Date } {
  const [year, month, day] = dateValue.split('-').map(Number);
  const start = new Date(year, month - 1, day, 10, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

@Component({
  selector: 'app-operations-center-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, AdminLayoutComponent, LucideAngularModule],
  templateUrl: './operations-center-page.component.html',
  styleUrls: ['./operations-center-page.component.css']
})
export class OperationsCenterPageComponent {
  private orderService = inject(OrderService);
  
  readonly Banknote = Banknote;
  readonly CalendarDays = CalendarDays;
  readonly CheckCircle2 = CheckCircle2;
  readonly CircleDollarSign = CircleDollarSign;
  readonly Clock3 = Clock3;
  readonly CreditCard = CreditCard;
  readonly PackageCheck = PackageCheck;
  readonly Percent = Percent;
  readonly ReceiptText = ReceiptText;
  readonly ShoppingBag = ShoppingBag;
  readonly Truck = Truck;
  readonly Wallet = Wallet;

  selectedDate = signal(toDateInputValue(new Date()));
  orders = this.orderService.orders;

  dayWindow = computed(() => buildDayWindow(this.selectedDate()));
  start = computed(() => this.dayWindow().start);
  end = computed(() => this.dayWindow().end);

  dayOrders = computed(() => {
    const s = this.start();
    const e = this.end();
    return this.orders().filter(order => {
      const createdAt = new Date(order.createdAt);
      return createdAt >= s && createdAt < e;
    });
  });

  totals = computed(() => {
    const ordersList = this.dayOrders();
    const revenue = ordersList.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const subtotal = ordersList.reduce((sum, order) => sum + Number(order.subtotal || 0), 0);
    const shipping = ordersList.reduce((sum, order) => sum + Number(order.shipping || 0), 0);
    const discounts = ordersList.reduce((sum, order) => sum + Number(order.discount || 0), 0);
    const items = ordersList.reduce(
      (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + Number(item.quantity || 0), 0),
      0
    );
    const discountedOrders = ordersList.filter(order => Number(order.discount || 0) > 0).length;
    const regularOrders = ordersList.length - discountedOrders;
    const paidOrders = ordersList.filter(order => order.paymentStatus === 'paid').length;
    const unpaidOrders = ordersList.length - paidOrders;
    const deliveredOrders = ordersList.filter(order => order.status === 'delivered').length;
    const activeOrders = ordersList.filter(order => !['delivered', 'postponed'].includes(order.status)).length;
    const bankTransfers = ordersList.filter(order => (order.paymentMethod || '').includes('DASHBOARD.AUTO_STR_437')).length;
    const walletOrders = ordersList.filter(order => (order.paymentMethod || '').includes('DASHBOARD.AUTO_STR_438')).length;

    return {
      revenue,
      subtotal,
      shipping,
      discounts,
      items,
      discountedOrders,
      regularOrders,
      paidOrders,
      unpaidOrders,
      deliveredOrders,
      activeOrders,
      bankTransfers,
      walletOrders,
      averageOrder: ordersList.length ? revenue / ordersList.length : 0,
      revenueUsd: revenue / TRY_PER_USD,
    };
  });

  cards = computed(() => {
    const t = this.totals();
    const len = this.dayOrders().length;
    return [
      { key: 'orders', label: 'DASHBOARD.AUTO_STR_214', value: this.formatNumber(len), hint: 'DASHBOARD.AUTO_STR_34', icon: ShoppingBag },
      { key: 'sar', label: 'DASHBOARD.AUTO_STR_53', value: `${this.formatMoney(t.revenue)} ₺`, hint: 'DASHBOARD.AUTO_STR_21', icon: Banknote },
      { key: 'usd', label: 'DASHBOARD.AUTO_STR_47', value: `$${this.formatMoney(t.revenueUsd)}`, hint: `قيمة تقديرية على أساس ${TRY_PER_USD} ليرة لكل دولار`, icon: CircleDollarSign },
      { key: 'items', label: 'DASHBOARD.AUTO_STR_152', value: this.formatNumber(t.items), hint: 'DASHBOARD.AUTO_STR_76', icon: PackageCheck },
      { key: 'discounted', label: 'DASHBOARD.AUTO_STR_297', value: this.formatNumber(t.discountedOrders), hint: `${this.formatMoney(t.discounts)} ₺ إجمالي الخصومات`, icon: Percent },
      { key: 'regular', label: 'DASHBOARD.AUTO_STR_111', value: this.formatNumber(t.regularOrders), hint: 'DASHBOARD.AUTO_STR_153', icon: ReceiptText },
      { key: 'paid', label: 'DASHBOARD.AUTO_STR_298', value: this.formatNumber(t.paidOrders), hint: `${this.formatNumber(t.unpaidOrders)} طلب غير مدفوع`, icon: CheckCircle2 },
      { key: 'active', label: 'DASHBOARD.AUTO_STR_154', value: this.formatNumber(t.activeOrders), hint: `${this.formatNumber(t.deliveredOrders)} طلب تم تسليمه`, icon: Truck },
      { key: 'average', label: 'DASHBOARD.AUTO_STR_171', value: `${this.formatMoney(t.averageOrder)} ₺`, hint: 'DASHBOARD.AUTO_STR_38', icon: Wallet },
      { key: 'shipping', label: 'DASHBOARD.AUTO_STR_155', value: `${this.formatMoney(t.shipping)} ₺`, hint: `${this.formatMoney(t.subtotal)} ₺ قيمة المنتجات قبل الشحن`, icon: CreditCard },
      { key: 'bank', label: 'DASHBOARD.AUTO_STR_257', value: this.formatNumber(t.bankTransfers), hint: 'DASHBOARD.AUTO_STR_22', icon: Banknote },
      { key: 'wallet', label: 'DASHBOARD.AUTO_STR_192', value: this.formatNumber(t.walletOrders), hint: 'DASHBOARD.AUTO_STR_23', icon: Wallet },
    ];
  });

  hourlyRows = computed(() => {
    const s = this.start();
    const ordersList = this.dayOrders();
    return Array.from({ length: 24 }, (_, index) => {
      const hourStart = new Date(s);
      hourStart.setHours(s.getHours() + index);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourEnd.getHours() + 1);
      const hourOrders = ordersList.filter(order => {
        const createdAt = new Date(order.createdAt);
        return createdAt >= hourStart && createdAt < hourEnd;
      });
      return {
        key: hourStart.toISOString(),
        label: `${this.formatHour(hourStart)} - ${this.formatHour(hourEnd)}`,
        count: hourOrders.length,
        total: hourOrders.reduce((sum, order) => sum + Number(order.total || 0), 0),
      };
    });
  });

  formatNumber(value: number): string {
    return new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 0 }).format(value);
  }

  formatMoney(value: number): string {
    return new Intl.NumberFormat('ar-EG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  formatHour(date: Date): string {
    return new Intl.DateTimeFormat('ar-EG', {
      hour: 'numeric',
      hour12: true,
    }).format(date);
  }

  moveDay(offset: number): void {
    const date = new Date(`${this.selectedDate()}T12:00:00`);
    date.setDate(date.getDate() + offset);
    this.selectedDate.set(toDateInputValue(date));
  }
}
