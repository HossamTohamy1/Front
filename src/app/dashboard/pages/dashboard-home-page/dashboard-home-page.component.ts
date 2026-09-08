import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import {  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  HostListener,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Database, Filter, Globe, Map as MapIcon, MapPin, Package, Truck, Users, Wallet } from 'lucide-angular';

import { DashboardFacade } from '../../facades/dashboard.facade';
import { AuthService } from '../../../core/services/auth/auth.service';
import {
  TrackedOrder,
  TrackedOrderStatus,
  TrackedOrderPaymentStatus,
  TrackedOrderItem,
  BankTransferReceipt,
} from '../../../domain/models/order.model';
import { StaffAccount } from '../../../domain/models/staff-account.model';
import {
  FilterSelectionKey,
  FilterOption,
  FilterShortcut,
} from '../../../domain/models/filter.model';
import { ORDER_STATUS_LABELS } from '../../../domain/enums/order-status.enum';
import { Product, Category } from '../../../domain/models/product.model';
import {
  DASHBOARD_WEEK_ORDER,
  formatISODate,
} from '../../../shared/utils/date.utils';

import { DashboardHeaderComponent } from '../../components/dashboard-header.component';
import { DashboardFiltersComponent } from '../../components/dashboard-filters.component';
import { DashboardTableToolsComponent } from '../../components/dashboard-table-tools.component';
import { DashboardOrdersTableComponent } from '../../components/dashboard-orders-table.component';
import { DashboardSidebarComponent } from '../../components/dashboard-sidebar.component';
import { DashboardModalsComponent } from '../../components/dashboard-modals.component';
import { DashboardFloatingChatComponent } from '../../components/dashboard-floating-chat.component';

type RowActionDialogKind = 'approve' | 'edit' | 'payment' | 'postpone' | 'status';

interface RowActionEditDraft {
  customerName: string;
  phone: string;
  country: string;
  city: string;
  area: string;
  address: string;
  deliveryCompany: string;
  paymentMethod: string;
  notes: string;
}

@Component({
  selector: 'app-dashboard-home-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, 
    CommonModule,
    FormsModule,
    RouterModule,
    DashboardHeaderComponent,
    DashboardFiltersComponent,
    DashboardTableToolsComponent,
    DashboardOrdersTableComponent,
    DashboardSidebarComponent,
    DashboardModalsComponent,
    DashboardFloatingChatComponent,
  ],
  templateUrl: './dashboard-home-page.component.html',
  styleUrls: ['./dashboard-home-page.component.css'],
})
export class DashboardHomePageComponent implements OnInit, OnDestroy {
  readonly facade = inject(DashboardFacade);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  readonly dashboardWeekOrder = DASHBOARD_WEEK_ORDER;
  readonly deliveryCompanies = ['سمسا', 'أرامكس', 'DHL', 'شركة كامكس للتوصيل', 'شركة أميال للتوصيل'];
  readonly paymentMethods = ['الدفع عند الاستلام', 'تحويل بنكي', 'بطاقة مدى', 'تمارا', 'تابي'];

  readonly filterShortcuts: FilterShortcut[] = [
    { key: 'all-orders', label: 'كل الطلبات', icon: Database },
    { key: 'status-filter', label: 'فلترة حسب الحالة', icon: Filter },
    { key: 'country-filter', label: 'تصفية حسب الدولة', icon: Globe },
    { key: 'city-filter', label: 'تصفية حسب المدينة', icon: MapPin },
    { key: 'area-filter', label: 'تصفية حسب المنطقة', icon: MapIcon },
    { key: 'gender-filter', label: 'فلترة حسب الجنس', icon: Users },
    { key: 'delivery-company-filter', label: 'تصفية حسب شركة التوصيل', icon: Truck },
    { key: 'payment-filter', label: 'تصفية حسب الدفع', icon: Wallet },
    { key: 'product-filter', label: 'فلترة حسب نوع المشد', icon: Package },
  ];

  readonly filterKeyMap: Partial<Record<string, FilterSelectionKey>> = {
    'status-filter': 'status',
    'country-filter': 'country',
    'city-filter': 'city',
    'area-filter': 'area',
    'gender-filter': 'gender',
    'delivery-company-filter': 'deliveryCompany',
    'payment-filter': 'paymentMethod',
    'product-filter': 'product',
  };

  isSidebarOpen = false;
  isDatePickerOpen = false;
  calendarCursor = new Date();
  expandedOrderId: string | null = null;
  activeProductsPopoverOrderId: string | null = null;

  catalogModal: 'products' | 'prices' | null = null;
  isApprovalsOpen = false;
  isPotentialCustomersOpen = false;
  isBulkStatusOpen = false;
  bulkStatusTarget: TrackedOrderStatus = 'confirmed';

  rowActionDialog: { orderId: string; kind: RowActionDialogKind } | null = null;
  rowActionValue = '';
  rowActionCustomDate = '';
  rowEditDraft: RowActionEditDraft = {
    customerName: '',
    phone: '',
    country: '',
    city: '',
    area: '',
    address: '',
    deliveryCompany: '',
    paymentMethod: '',
    notes: '',
  };
  rowProductDraft: TrackedOrderItem[] = [];
  selectedBankReceipt: { orderNumber: string; receipt: BankTransferReceipt } | null = null;

  isChatOpen = false;
  activeChatId: string | null = null;

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  get orders(): TrackedOrder[] { return this.facade.orders(); }
  get activeAccount(): StaffAccount { return this.facade.activeAccount(); }
  get chatConversations() { return this.facade.chatConversations(); }
  get allStoreProducts(): Product[] { return this.facade.products(); }
  get copyNotice(): string | null { return this.facade.notice(); }
  get newOrdersCount(): number { return this.facade.newOrdersCount(); }
  get pendingApprovalsCount(): number { return this.facade.pendingApprovalsCount(); }
  get filteredOrders(): TrackedOrder[] { return this.facade.filteredOrders(); }
  get paginatedOrders(): TrackedOrder[] { return this.facade.paginatedOrders(); }
  get totalPages(): number { return this.facade.totalPages(); }
  get filterSelections() { return this.facade.filterSelections(); }
  get openFilterKey(): FilterSelectionKey | null { return this.facade.openFilterKey(); }
  get activeFilterOptions(): FilterOption[] { return this.facade.activeFilterOptions(); }

  get filterSearchQuery(): string { return this.facade.filterSearchQuery(); }
  set filterSearchQuery(val: string) { this.facade.filterSearchQuery.set(val); }

  get searchQuery(): string { return this.facade.searchQuery(); }
  set searchQuery(val: string) { this.facade.searchQuery.set(val); }

  get selectedDate(): string { return this.facade.selectedDate(); }
  set selectedDate(val: string) { this.facade.selectedDate.set(val); }

  get itemsPerPage(): number { return this.facade.itemsPerPage(); }
  set itemsPerPage(val: number) { this.facade.itemsPerPage.set(val); }

  get ordersPage(): number { return this.facade.ordersPage(); }
  set ordersPage(val: number) { this.facade.ordersPage.set(val); }

  toggleFilter(key: string): void {
    if (key === 'all-orders') {
      this.facade.resetAllFilters();
      this.facade.showNotice('تمت إعادة ضبط جميع الفلاتر');
      return;
    }
    const targetKey = this.filterKeyMap[key];
    if (!targetKey) return;

    if (this.openFilterKey === targetKey) {
      this.facade.openFilterKey.set(null);
    } else {
      this.facade.openFilterKey.set(targetKey);
      this.facade.filterSearchQuery.set('');
    }
  }

  selectFilterOption(key: FilterSelectionKey, value: string): void {
    this.facade.selectFilterOption(key, value);
  }

  clearFilter(key: FilterSelectionKey): void {
    this.facade.clearFilter(key);
  }

  async copyOrderValue(value: string, label: string): Promise<void> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      }
    } catch {}
    this.facade.showNotice(`تم نسخ ${label}`);
  }

  toggleExpandRow(orderId: string): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  toggleProductsPopover(orderId: string): void {
    this.activeProductsPopoverOrderId = this.activeProductsPopoverOrderId === orderId ? null : orderId;
  }

  get calendarYear(): number { return this.calendarCursor.getFullYear(); }
  get calendarMonth(): number { return this.calendarCursor.getMonth(); }
  get calendarCells(): (number | null)[] {
    const year = this.calendarYear;
    const month = this.calendarMonth;
    const daysCount = new Date(year, month + 1, 0).getDate();
    const firstWeekDay = new Date(year, month, 1).getDay();
    const blanks = this.dashboardWeekOrder.indexOf(firstWeekDay);
    return [
      ...Array.from({ length: Math.max(0, blanks) }, () => null),
      ...Array.from({ length: daysCount }, (_, i) => i + 1),
    ];
  }

  toggleDatePicker(): void { this.isDatePickerOpen = !this.isDatePickerOpen; }
  changeCalendarMonth(offset: number): void {
    this.calendarCursor = new Date(this.calendarYear, this.calendarMonth + offset, 1);
  }
  chooseCalendarDate(day: number): void {
    const d = new Date(this.calendarYear, this.calendarMonth, day);
    this.selectedDate = formatISODate(d);
    this.isDatePickerOpen = false;
  }
  clearDateFilter(): void {
    this.selectedDate = '';
    this.isDatePickerOpen = false;
  }

  downloadOrders(): void { this.facade.exportOrdersCsv(); }
  openBulkStatusModal(): void { this.isBulkStatusOpen = true; }
  confirmBulkStatus(status?: TrackedOrderStatus): void {
    this.facade.bulkUpdateStatus(status || this.bulkStatusTarget);
    this.isBulkStatusOpen = false;
  }

  openPotentialCustomersModal(): void { this.isPotentialCustomersOpen = true; }

  openRowAction(orderId: string, kind: RowActionDialogKind): void {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;
    this.rowActionDialog = { orderId, kind };

    if (kind === 'edit') {
      this.rowEditDraft = {
        customerName: order.customerName,
        phone: order.phone,
        country: order.country,
        city: order.city,
        area: order.area,
        address: order.address,
        deliveryCompany: order.deliveryCompany,
        paymentMethod: order.paymentMethod,
        notes: order.notes || '',
      };
      this.rowProductDraft = JSON.parse(JSON.stringify(order.items));
    } else if (kind === 'status') {
      this.rowActionValue = order.status;
    } else if (kind === 'payment') {
      this.rowActionValue = order.paymentStatus || 'unpaid';
    } else if (kind === 'postpone') {
      this.rowActionValue = '14';
      this.rowActionCustomDate = '';
    } else if (kind === 'approve') {
      if (order.bankTransferReceipt) {
        this.selectedBankReceipt = {
          orderNumber: order.orderNumber,
          receipt: order.bankTransferReceipt,
        };
      }
    }
  }

  closeRowAction(): void {
    this.rowActionDialog = null;
    this.selectedBankReceipt = null;
  }

  saveRowActionFromModal(event: { draft: any; value: string }): void {
    if (!this.rowActionDialog) return;
    const { orderId, kind } = this.rowActionDialog;
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    if (kind === 'edit') {
      const subtotal = this.rowProductDraft.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
      const total = subtotal + order.shipping - order.discount;
      this.facade.updateOrder(orderId, {
        ...event.draft,
        items: this.rowProductDraft,
        subtotal,
        total,
      });
      this.facade.showNotice('تم تحديث بيانات الطلب بنجاح');
    } else if (kind === 'status') {
      this.facade.updateOrder(orderId, { status: event.value as TrackedOrderStatus });
      this.facade.showNotice(`تم تغيير حالة الطلب إلى ${ORDER_STATUS_LABELS[event.value as TrackedOrderStatus]}`);
    } else if (kind === 'payment') {
      this.facade.updateOrder(orderId, { paymentStatus: event.value as TrackedOrderPaymentStatus });
      this.facade.showNotice('تم تحديث حالة الدفع');
    } else if (kind === 'postpone') {
      const days = parseInt(event.value, 10) || 14;
      const date = new Date();
      date.setDate(date.getDate() + days);
      this.facade.updateOrder(orderId, {
        status: 'postponed',
        estimatedDelivery: this.rowActionCustomDate || formatISODate(date),
      });
      this.facade.showNotice('تم تأجيل الطلب بنجاح');
    } else if (kind === 'approve') {
      this.facade.updateOrder(orderId, { status: 'confirmed', paymentStatus: 'paid' });
      this.facade.showNotice('تم اعتماد التحويل البنكي');
    }
    this.closeRowAction();
  }

  approveBankTransfer(orderId: string): void {
    this.facade.updateOrder(orderId, { status: 'confirmed', paymentStatus: 'paid' });
    this.facade.showNotice('تم اعتماد التحويل البنكي');
    this.isApprovalsOpen = false;
  }

  openSidebar(): void { this.isSidebarOpen = true; }
  closeSidebar(): void { this.isSidebarOpen = false; }
  navigateMenu(path: string): void { this.closeSidebar(); this.router.navigateByUrl(path); }
  logout(): void { this.authService.setUser(null); this.closeSidebar(); this.router.navigate(['/'], { replaceUrl: true }); }

  toggleFloatingChat(): void {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen && !this.activeChatId && this.chatConversations.length > 0) {
      this.activeChatId = this.chatConversations[0].id;
    }
  }

  selectConversation(id: string): void {
    this.activeChatId = id;
    const conv = this.chatConversations.find(c => c.id === id);
    if (conv) conv.unread = 0;
  }

  sendChatMessageFromChild(text: string): void {
    if (!this.activeChatId) return;
    this.facade.sendChatMessage(this.activeChatId, text);
  }
}
