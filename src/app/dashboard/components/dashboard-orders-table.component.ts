import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, CheckCircle2, Edit3, CreditCard, PauseCircle, RefreshCcw, ShoppingBag } from 'lucide-angular';
import { TrackedOrder, TrackedOrderStatus, BankTransferReceipt } from '../../domain/models/order.model';
import { ORDER_STATUS_LABELS, ORDER_STATUS_CLASSES } from '../../domain/enums/order-status.enum';
import { buildWhatsAppUrl } from '../../shared/utils/phone.utils';

@Component({
  selector: 'app-dashboard-orders-table',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, LucideAngularModule],
  template: `
    <section class="dashboard-orders">
      <div class="dashboard-orders__scroll">
        <table class="dashboard-orders__table dashboard-orders__table--store-orders">
          <thead>
            <tr>
              <th>{{ 'ORDERS.ORDER_NUMBER' | translate }}</th>
              <th>{{ 'CHECKOUT.CUSTOMER_NAME' | translate }}</th>
              <th>{{ 'CHECKOUT.PHONE' | translate }}</th>
              <th>{{ 'ORDERS.ORDER_DATE' | translate }}</th>
              <th>{{ 'CHECKOUT.COUNTRY' | translate }}</th>
              <th>{{ 'CHECKOUT.CITY' | translate }}</th>
              <th>{{ 'DASHBOARD.AUTO_STR_393' | translate }}</th>
              <th>{{ 'DASHBOARD.AUTO_STR_422' | translate }}</th>
              <th>{{ 'COMMON.ADDRESS' | translate }}</th>
              <th>{{ 'DASHBOARD.AUTO_STR_263' | translate }}</th>
              <th>{{ 'CHECKOUT.PAYMENT_METHOD' | translate }}</th>
              <th>{{ 'DASHBOARD.AUTO_STR_343' | translate }}</th>
              <th>{{ 'DASHBOARD.AUTO_STR_370' | translate }}</th>
              <th>{{ 'DASHBOARD.AUTO_STR_310' | translate }}</th>
              <th>{{ 'COMMON.MESSAGE' | translate }}</th>
              <th>{{ 'COMMON.PRODUCTS' | translate }}</th>
              <th [attr.aria-label]="'COMMON.ACTIONS' | translate"></th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let order of orders">
              <tr [class.is-expanded]="expandedOrderId === order.id">
                <td>
                  <button
                    type="button"
                    class="dashboard-copy-value dashboard-orders__receipt dashboard-number"
                    (click)="copyValue.emit({ value: order.orderNumber, label: 'رقم الطلب' })"
                    [attr.title]="'DASHBOARD.AUTO_STR_94' | translate"
                  >
                    {{ order.orderNumber }}
                  </button>
                </td>

                <td>{{ order.customerName }}</td>

                <td>
                  <button
                    type="button"
                    class="dashboard-copy-value dashboard-orders__phone dashboard-number"
                    (click)="copyValue.emit({ value: order.phone, label: 'رقم الهاتف' })"
                    [attr.title]="'DASHBOARD.AUTO_STR_78' | translate"
                  >
                    {{ order.phone }}
                  </button>
                </td>

                <td>
                  <span class="dashboard-date dashboard-number">{{ order.createdAt | slice:0:10 }}</span>
                </td>

                <td>
                  <span class="dashboard-country">
                    <span>🇸🇦</span>
                    <span>{{ order.country }}</span>
                  </span>
                </td>

                <td>{{ order.city || '—' }}</td>
                <td>{{ order.area || '—' }}</td>
                <td>{{ order.gender || ('COMMON.WOMENS' | translate) }}</td>
                <td class="dashboard-orders__address" [title]="order.address">{{ order.address }}</td>
                <td class="dashboard-orders__delivery">{{ order.deliveryCompany }}</td>

                <td class="dashboard-orders__payment">
                  <span>{{ order.paymentMethod }}</span>
                  <button
                    *ngIf="order.bankTransferReceipt"
                    type="button"
                    class="dashboard-bank-receipt"
                    (click)="rowAction.emit({ orderId: order.id, kind: 'approve' })"
                    [attr.title]="'DASHBOARD.AUTO_STR_95' | translate"
                  >
                    <img [src]="order.bankTransferReceipt.dataUrl" [alt]="'إيصال تحويل الطلب ' + order.orderNumber" />
                  </button>
                </td>

                <ng-container *ngIf="expandedOrderId === order.id">
                  <td colspan="6" class="dashboard-order-actions-cell">
                    <div class="dashboard-order-actions" role="toolbar">
                      <button
                        type="button"
                        class="dashboard-order-expand dashboard-order-expand--inline is-open"
                        (click)="toggleExpand.emit(order.id)"
                        [attr.aria-label]="'DASHBOARD.AUTO_STR_96' | translate"
                      >
                        <lucide-icon [img]="ChevronLeftIcon" [size]="19" strokeWidth="2.3"></lucide-icon>
                      </button>

                      <button
                        *ngIf="order.status === 'pending-approval' || order.bankTransferReceipt"
                        type="button"
                        class="dashboard-order-action dashboard-order-action--approve"
                        (click)="rowAction.emit({ orderId: order.id, kind: 'approve' })"
                      >
                        <lucide-icon [img]="CheckCircle2Icon" [size]="15"></lucide-icon>
                        <span>{{ 'DASHBOARD.AUTO_STR_195' | translate }}</span>
                      </button>

                      <button
                        type="button"
                        class="dashboard-order-action dashboard-order-action--edit"
                        (click)="rowAction.emit({ orderId: order.id, kind: 'edit' })"
                      >
                        <lucide-icon [img]="Edit3Icon" [size]="15"></lucide-icon>
                        <span>{{ 'ADMIN.EDIT_ORDER' | translate }}</span>
                      </button>

                      <button
                        type="button"
                        class="dashboard-order-action dashboard-order-action--payment"
                        [class.is-paid]="order.paymentStatus === 'paid'"
                        (click)="rowAction.emit({ orderId: order.id, kind: 'payment' })"
                      >
                        <lucide-icon [img]="CreditCardIcon" [size]="15"></lucide-icon>
                        <span>{{ 'DASHBOARD.AUTO_STR_344' | translate }}</span>
                      </button>

                      <button
                        type="button"
                        class="dashboard-order-action dashboard-order-action--postpone"
                        [class.is-active]="order.status === 'postponed'"
                        (click)="rowAction.emit({ orderId: order.id, kind: 'postpone' })"
                      >
                        <lucide-icon [img]="PauseCircleIcon" [size]="15"></lucide-icon>
                        <span>{{ 'DASHBOARD.AUTO_STR_371' | translate }}</span>
                      </button>

                      <button
                        type="button"
                        class="dashboard-order-action dashboard-order-action--status"
                        (click)="rowAction.emit({ orderId: order.id, kind: 'status' })"
                      >
                        <lucide-icon [img]="RefreshCcwIcon" [size]="15"></lucide-icon>
                        <span>{{ 'DASHBOARD.AUTO_STR_384' | translate }}</span>
                      </button>
                    </div>
                  </td>
                </ng-container>

                <ng-container *ngIf="expandedOrderId !== order.id">
                  <td>
                    <button
                      type="button"
                      [ngClass]="statusClassMap[order.status]"
                      (click)="rowAction.emit({ orderId: order.id, kind: 'status' })"
                      [attr.title]="'DASHBOARD.AUTO_STR_113' | translate"
                    >
                      {{ statusLabels[order.status] }}
                    </button>
                  </td>

                  <td>
                    <span class="dashboard-date dashboard-number">{{ order.updatedAt | slice:0:10 }}</span>
                  </td>

                  <td>
                    <div class="dashboard-amount">
                      <span class="dashboard-amount__main">
                        <span class="dashboard-number">{{ order.total }} SAR</span>
                      </span>
                      <span class="dashboard-amount__badge">
                        <span class="dashboard-number">{{ (order.items && order.items.length > 0) ? order.items[0].quantity : 1 }}x PCS</span>
                      </span>
                    </div>
                  </td>

                  <td>
                    <button
                      type="button"
                      class="dashboard-whatsapp-button"
                      (click)="openWhatsApp(order)"
                      [attr.title]="'DASHBOARD.AUTO_STR_42' | translate"
                    >
                      <img src="assets/dashboard/whatsapp-button.png" alt="WhatsApp" />
                    </button>
                  </td>

                  <td class="dashboard-orders__products-cell">
                    <div class="dashboard-orders__products-controls">
                      <button
                        type="button"
                        class="dashboard-products-button"
                        (click)="toggleProductsPopover.emit(order.id)"
                        [attr.title]="'DASHBOARD.AUTO_STR_158' | translate"
                      >
                        <lucide-icon [img]="ShoppingBagIcon" [size]="15"></lucide-icon>
                      </button>

                      <div class="dashboard-products-popover" *ngIf="activeProductsPopoverOrderId === order.id">
                        <div class="dashboard-products-popover__title">{{ 'DASHBOARD.AUTO_STR_264' | translate }}</div>
                        <div class="dashboard-products-popover__list">
                          <div class="dashboard-products-popover__item" *ngFor="let item of order.items">
                            <img [src]="item.image" [alt]="item.name" />
                            <div>
                              <strong>{{ item.name }}</strong>
                              <span>الكمية: {{ item.quantity }} · المقاس: {{ item.size }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="dashboard-orders__arrow-cell">
                    <button
                      type="button"
                      class="dashboard-order-expand"
                      (click)="toggleExpand.emit(order.id)"
                      [attr.aria-label]="'DASHBOARD.AUTO_STR_128' | translate"
                    >
                      <lucide-icon [img]="ChevronLeftIcon" [size]="18" strokeWidth="2.2"></lucide-icon>
                    </button>
                  </td>
                </ng-container>
              </tr>
            </ng-container>

            <tr *ngIf="orders.length === 0">
              <td class="dashboard-orders__empty" colspan="17">
                لا توجد طلبات مطابقة للبحث أو الفلاتر الحالية.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <nav class="dashboard-orders-pagination" *ngIf="totalPages > 1" [attr.aria-label]="'DASHBOARD.AUTO_STR_220' | translate">
        <button type="button" [disabled]="ordersPage === 1" (click)="pageChange.emit(ordersPage - 1)">{{ 'COMMON.PREVIOUS' | translate }}</button>
        <span class="dashboard-orders-pagination__info">صفحة {{ ordersPage }} من {{ totalPages }}</span>
        <button type="button" [disabled]="ordersPage === totalPages" (click)="pageChange.emit(ordersPage + 1)">{{ 'COMMON.NEXT' | translate }}</button>
      </nav>
    </section>
  `,
})
export class DashboardOrdersTableComponent {
  readonly ChevronLeftIcon = ChevronLeft;
  readonly CheckCircle2Icon = CheckCircle2;
  readonly Edit3Icon = Edit3;
  readonly CreditCardIcon = CreditCard;
  readonly PauseCircleIcon = PauseCircle;
  readonly RefreshCcwIcon = RefreshCcw;
  readonly ShoppingBagIcon = ShoppingBag;

  readonly statusLabels = ORDER_STATUS_LABELS;
  readonly statusClassMap = ORDER_STATUS_CLASSES;

  @Input() orders: TrackedOrder[] = [];
  @Input() expandedOrderId: string | null = null;
  @Input() activeProductsPopoverOrderId: string | null = null;
  @Input() ordersPage = 1;
  @Input() totalPages = 1;

  @Output() copyValue = new EventEmitter<{ value: string; label: string }>();
  @Output() toggleExpand = new EventEmitter<string>();
  @Output() toggleProductsPopover = new EventEmitter<string>();
  @Output() rowAction = new EventEmitter<{ orderId: string; kind: 'approve' | 'edit' | 'payment' | 'postpone' | 'status' }>();
  @Output() pageChange = new EventEmitter<number>();

  openWhatsApp(order: TrackedOrder): void {
    const url = buildWhatsAppUrl(
      order.phone,
      `أهلاً بك يا ${order.customerName}، معك متجر LOXX KING بخصوص طلبك رقم ${order.orderNumber}.`,
      order.country
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

