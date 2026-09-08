import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Edit3, Save, X } from 'lucide-angular';

import { AdminLayoutComponent } from '../../../shared/components/layout/admin-layout/admin-layout.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';

import { LangService } from '../../../core/services/lang/lang.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { orders as allOrders } from '../../../shared/data/mockData';

const nextStatus: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'shipped',
  shipped: 'delivered',
};

const actionLabel: Record<string, { en: string; ar: string }> = {
  pending: { en: 'Accept Order', ar: 'COMMON.ACCEPTORDER' },
  confirmed: { en: 'Mark as Shipped', ar: 'DASHBOARD.AUTO_STR_299' },
  shipped: { en: 'Mark as Delivered', ar: 'DASHBOARD.AUTO_STR_300' },
};

@Component({
  selector: 'app-order-review-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, 
    CommonModule,
    FormsModule,
    RouterModule,
    LucideAngularModule,
    AdminLayoutComponent,
    BadgeComponent,
    ButtonComponent,
    ModalComponent
  ],
  templateUrl: './order-review-page.component.html',
  styleUrls: ['./order-review-page.component.css']
})
export class OrderReviewPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private langService = inject(LangService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  readonly ArrowLeftIcon = ArrowLeft;
  readonly Edit3Icon = Edit3;
  readonly SaveIcon = Save;
  readonly XIcon = X;

  lang = this.langService.lang;
  dir = this.langService.dir;
  isAdmin = computed(() => this.authService.user()?.role === 'admin');

  orderId = this.route.snapshot.paramMap.get('id');
  
  order = signal<any>(allOrders.find(o => o.id === this.orderId));
  
  editOpen = signal(false);
  editForm = signal<any>({});

  constructor() {
    if (this.order()) {
      this.initEditForm();
    }
  }

  initEditForm() {
    const o = this.order();
    this.editForm.set({
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      address: o.address,
      city: o.city,
      country: o.country,
      notes: o.notes,
      shipmentCode: o.shipmentCode ?? '',
    });
  }

  get canAdvance() {
    return !!nextStatus[this.order()?.status];
  }

  getActionLabel() {
    const status = this.order()?.status;
    if (!status || !actionLabel[status]) return '';
    return this.lang() === 'ar' ? actionLabel[status].ar : actionLabel[status].en;
  }

  handleStatusChange() {
    const currentStatus = this.order()?.status;
    const next = nextStatus[currentStatus];
    if (!next) return;
    
    this.order.update(o => ({ ...o, status: next }));
    this.toastService.showToast(this.lang() === 'ar' ? 'DASHBOARD.AUTO_STR_194' : 'Status updated', 'success');
  }

  handleCancelOrder() {
    this.order.update(o => ({ ...o, status: 'cancelled' }));
    this.toastService.showToast(this.lang() === 'ar' ? 'DASHBOARD.AUTO_STR_216' : 'Order cancelled', 'error');
  }

  openEdit() {
    this.initEditForm();
    this.editOpen.set(true);
  }

  closeEdit() {
    this.editOpen.set(false);
  }

  updateEditForm(key: string, value: string) {
    this.editForm.update(f => ({ ...f, [key]: value }));
  }

  handleSaveEdit() {
    const form = this.editForm();
    this.order.update(o => ({
      ...o,
      ...form,
      shipmentCode: form.shipmentCode || undefined
    }));
    this.editOpen.set(false);
    this.toastService.showToast(this.lang() === 'ar' ? 'DASHBOARD.AUTO_STR_39' : 'Changes saved and logged to audit trail', 'success');
  }

  getVariant(status: string) {
    if (status === 'delivered') return 'success';
    if (status === 'cancelled') return 'danger';
    if (status === 'shipped') return 'primary';
    return 'warning';
  }

  getStatusLabel(status: string, isAr: boolean) {
    const labels: Record<string, {ar: string, en: string}> = {
      'pending': {ar: 'COMMON.PENDING', en: 'Pending'},
      'confirmed': {ar: 'COMMON.CONFIRMED', en: 'Confirmed'},
      'shipped': {ar: 'COMMON.SHIPPED', en: 'Shipped'},
      'delivered': {ar: 'DASHBOARD.AUTO_STR_341', en: 'Delivered'},
      'cancelled': {ar: 'COMMON.CANCELLED', en: 'Cancelled'}
    };
    return labels[status] ? (isAr ? labels[status].ar : labels[status].en) : status;
  }

  get editFormKeys() {
    return Object.keys(this.editForm());
  }

  formatKeyName(key: string) {
    return key.replace(/([A-Z])/g, ' $1').toLowerCase();
  }
}
