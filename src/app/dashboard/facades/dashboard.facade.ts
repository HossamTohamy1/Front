import { Injectable, inject, signal, computed } from '@angular/core';
import { OrderRepositoryImpl } from '../../data/repositories/order.repository.impl';
import { StaffRepositoryImpl } from '../../data/repositories/staff.repository.impl';
import { ChatRepositoryImpl } from '../../data/repositories/chat.repository.impl';
import { ProductRepositoryImpl } from '../../data/repositories/product.repository.impl';
import {
  TrackedOrder,
  TrackedOrderStatus,
  TrackedOrderPaymentStatus,
  TrackedOrderItem,
  BankTransferReceipt,
} from '../../domain/models/order.model';
import { StaffAccount } from '../../domain/models/staff-account.model';
import { ChatConversation, ChatMessage } from '../../domain/models/chat.model';
import {
  FilterSelectionKey,
  FilterSelections,
  FilterOption,
  FilterShortcut,
} from '../../domain/models/filter.model';
import { ORDER_STATUS_LABELS, ORDER_STATUS_CLASSES } from '../../domain/enums/order-status.enum';
import { PAYMENT_STATUS_LABELS } from '../../domain/enums/payment-status.enum';
import { Product, Category } from '../../domain/models/product.model';
import { exportToCsv } from '../../shared/utils/csv-export.utils';
import { formatWhatsAppPhone, buildWhatsAppUrl } from '../../shared/utils/phone.utils';
import { getInitials } from '../../shared/utils/initials.utils';

@Injectable({
  providedIn: 'root',
})
export class DashboardFacade {
  private orderRepo = inject(OrderRepositoryImpl);
  private staffRepo = inject(StaffRepositoryImpl);
  private chatRepo = inject(ChatRepositoryImpl);
  private productRepo = inject(ProductRepositoryImpl);

  readonly orders = signal<TrackedOrder[]>([]);
  readonly staffAccounts = signal<StaffAccount[]>([]);
  readonly activeAccountId = signal<string>('staff-admin');
  readonly chatConversations = signal<ChatConversation[]>([]);
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);

  readonly filterSelections = signal<FilterSelections>({});
  readonly openFilterKey = signal<FilterSelectionKey | null>(null);
  readonly filterSearchQuery = signal<string>('');
  readonly searchQuery = signal<string>('');
  readonly selectedDate = signal<string>('');
  readonly itemsPerPage = signal<number>(10);
  readonly ordersPage = signal<number>(1);

  readonly notice = signal<string | null>(null);
  private noticeTimer: any = null;

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.orderRepo.getOrders().subscribe(orders => this.orders.set(orders));
    this.staffRepo.getStaffAccounts().subscribe(accounts => this.staffAccounts.set(accounts));
    this.staffRepo.getActiveAccountId().subscribe(id => this.activeAccountId.set(id));
    this.chatRepo.getConversations().subscribe(convs => this.chatConversations.set(convs));
    this.productRepo.getProducts().subscribe(prods => this.products.set(prods));
    this.productRepo.getCategories().subscribe(cats => this.categories.set(cats));
  }

  readonly activeAccount = computed<StaffAccount>(() => {
    const list = this.staffAccounts();
    const id = this.activeAccountId();
    return list.find(a => a.id === id) || list[0] || {
      id: 'staff-admin',
      name: 'Nadeen',
      email: 'admin@loxxking.com',
      role: 'admin',
      roleLabel: 'مدير النظام',
    };
  });

  readonly newOrdersCount = computed<number>(() => {
    return this.orders().filter(o => o.status === 'confirmed').length;
  });

  readonly pendingApprovalsCount = computed<number>(() => {
    return this.orders().filter(o => o.status === 'pending-approval' || o.bankTransferReceipt).length;
  });

  readonly filteredOrders = computed<TrackedOrder[]>(() => {
    let list = this.orders();
    const q = this.searchQuery().trim().toLowerCase();
    const date = this.selectedDate();
    const filters = this.filterSelections();

    if (q) {
      list = list.filter(
        o =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.city.toLowerCase().includes(q) ||
          o.country.toLowerCase().includes(q)
      );
    }

    if (date) {
      list = list.filter(o => o.createdAt.startsWith(date));
    }

    const keys: FilterSelectionKey[] = [
      'status',
      'country',
      'city',
      'area',
      'gender',
      'deliveryCompany',
      'paymentMethod',
      'product',
    ];

    keys.forEach(key => {
      const val = filters[key];
      if (!val) return;

      if (key === 'status') {
        list = list.filter(o => ORDER_STATUS_LABELS[o.status] === val || o.status === val);
      } else if (key === 'country') {
        list = list.filter(o => o.country === val);
      } else if (key === 'city') {
        list = list.filter(o => o.city === val);
      } else if (key === 'area') {
        list = list.filter(o => o.area === val);
      } else if (key === 'gender') {
        list = list.filter(o => (o.gender || 'نسائي') === val);
      } else if (key === 'deliveryCompany') {
        list = list.filter(o => o.deliveryCompany === val);
      } else if (key === 'paymentMethod') {
        list = list.filter(o => o.paymentMethod === val);
      } else if (key === 'product') {
        list = list.filter(o => o.items.some(item => item.name === val));
      }
    });

    return list;
  });

  readonly paginatedOrders = computed<TrackedOrder[]>(() => {
    const list = this.filteredOrders();
    const start = (this.ordersPage() - 1) * this.itemsPerPage();
    return list.slice(start, start + this.itemsPerPage());
  });

  readonly totalPages = computed<number>(() => {
    return Math.max(1, Math.ceil(this.filteredOrders().length / this.itemsPerPage()));
  });

  readonly filterCounts = computed<Record<FilterSelectionKey, FilterOption[]>>(() => {
    const orders = this.orders();
    const buildOptions = (items: string[]): FilterOption[] => {
      const counts = new Map<string, number>();
      items.filter(Boolean).forEach(v => counts.set(v, (counts.get(v) || 0) + 1));
      return Array.from(counts.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, 'ar'));
    };

    const productNames: string[] = [];
    orders.forEach(o => o.items.forEach(it => productNames.push(it.name)));

    return {
      status: buildOptions(orders.map(o => ORDER_STATUS_LABELS[o.status])),
      country: buildOptions(orders.map(o => o.country)),
      city: buildOptions(orders.map(o => o.city)),
      area: buildOptions(orders.map(o => o.area)),
      gender: buildOptions(orders.map(o => o.gender || 'نسائي')),
      deliveryCompany: buildOptions(orders.map(o => o.deliveryCompany)),
      paymentMethod: buildOptions(orders.map(o => o.paymentMethod)),
      product: buildOptions(productNames),
    };
  });

  readonly activeFilterOptions = computed<FilterOption[]>(() => {
    const key = this.openFilterKey();
    if (!key) return [];
    const options = this.filterCounts()[key] || [];
    const q = this.filterSearchQuery().trim().toLowerCase();
    if (!q) return options;
    return options.filter(opt => opt.value.toLowerCase().includes(q));
  });

  switchAccount(account: StaffAccount): void {
    this.activeAccountId.set(account.id);
    this.staffRepo.setActiveAccountId(account.id).subscribe();
    this.showNotice(`تم الانتقال إلى حساب ${account.name}`);
  }

  showNotice(msg: string): void {
    this.notice.set(msg);
    if (this.noticeTimer) clearTimeout(this.noticeTimer);
    this.noticeTimer = setTimeout(() => this.notice.set(null), 2400);
  }

  selectFilterOption(key: FilterSelectionKey, value: string): void {
    const current = { ...this.filterSelections() };
    if (current[key] === value) {
      delete current[key];
    } else {
      current[key] = value;
    }
    this.filterSelections.set(current);
    this.openFilterKey.set(null);
    this.filterSearchQuery.set('');
    this.ordersPage.set(1);
  }

  clearFilter(key: FilterSelectionKey): void {
    const current = { ...this.filterSelections() };
    delete current[key];
    this.filterSelections.set(current);
    this.openFilterKey.set(null);
    this.filterSearchQuery.set('');
  }

  resetAllFilters(): void {
    this.filterSelections.set({});
    this.searchQuery.set('');
    this.selectedDate.set('');
    this.openFilterKey.set(null);
  }

  updateOrder(id: string, updates: Partial<TrackedOrder>): void {
    const updater = { name: this.activeAccount().name };
    this.orderRepo.updateOrder(id, { ...updates, statusUpdatedBy: updater }).subscribe(updated => {
      this.orders.update(list => list.map(o => (o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o)));
    });
  }

  bulkUpdateStatus(status: TrackedOrderStatus): void {
    const ids = this.filteredOrders().map(o => o.id);
    const updater = { name: this.activeAccount().name };
    this.orderRepo.bulkUpdateStatus(ids, status, updater).subscribe(() => {
      this.orders.update(list => {
        const set = new Set(ids);
        return list.map(o => (set.has(o.id) ? { ...o, status, updatedAt: new Date().toISOString() } : o));
      });
      this.showNotice(`تم تحديث حالة ${ids.length} طلب إلى ${ORDER_STATUS_LABELS[status]}`);
    });
  }

  exportOrdersCsv(): void {
    const rows = [
      ['رقم الطلب', 'اسم العميل', 'رقم الهاتف', 'تاريخ الطلب', 'الدولة', 'المدينة', 'المنطقة', 'الجنس', 'العنوان', 'شركة التوصيل', 'طريقة الدفع', 'الحالة', 'الإجمالي'],
      ...this.filteredOrders().map(o => [
        o.orderNumber,
        o.customerName,
        o.phone,
        o.createdAt.slice(0, 10),
        o.country,
        o.city,
        o.area,
        o.gender || 'نسائي',
        o.address,
        o.deliveryCompany,
        o.paymentMethod,
        ORDER_STATUS_LABELS[o.status],
        o.total,
      ]),
    ];
    exportToCsv(`loxx-orders-${new Date().toISOString().slice(0, 10)}`, rows);
    this.showNotice('تم تنزيل ملف الطلبات بنجاح');
  }

  sendChatMessage(conversationId: string, text: string): void {
    if (!text.trim()) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    this.chatRepo.sendMessage(conversationId, {
      sender: 'staff',
      text: text.trim(),
      time,
      kind: 'text',
    }).subscribe(msg => {
      this.chatConversations.update(convs =>
        convs.map(c =>
          c.id === conversationId
            ? { ...c, messages: [...c.messages, msg], lastMessage: text.trim(), lastTime: time }
            : c
        )
      );
    });
  }
}
