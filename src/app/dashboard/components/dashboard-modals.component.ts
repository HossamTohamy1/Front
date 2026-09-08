import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
﻿import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X } from 'lucide-angular';
import { Product } from '../../domain/models/product.model';
import { TrackedOrder, TrackedOrderStatus, BankTransferReceipt } from '../../domain/models/order.model';

@Component({
  selector: 'app-dashboard-modals',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule],
  template: `
    <!-- 1. Catalog / Prices Modal -->
    <div class="dashboard-modal-layer" *ngIf="catalogModal">
      <div class="dashboard-modal-backdrop" (click)="closeCatalog.emit()"></div>
      <div class="dashboard-modal dashboard-modal--catalog" dir="rtl">
        <header class="dashboard-modal__header">
          <h3>{{ catalogModal === 'products' ? 'كتالوج المنتجات والمشدات' : 'قائمة الأسعار والتسعير' }}</h3>
          <button type="button" (click)="closeCatalog.emit()" class="dashboard-modal__close">
            <lucide-icon [img]="XIcon" [size]="18"></lucide-icon>
          </button>
        </header>

        <div class="dashboard-modal__toolbar">
          <div class="dashboard-search-input">
            <input type="text" [(ngModel)]="catalogSearch" placeholder="ابحث عن منتج..." />
          </div>
        </div>

        <div class="dashboard-catalog-grid">
          <div class="dashboard-catalog-card" *ngFor="let prod of filteredCatalogProducts">
            <img [src]="prod.images[0]" [alt]="prod.nameAr" />
            <div class="prod-details">
              <strong>{{ prod.nameAr }}</strong>
              <p class="prod-price">{{ prod.price }} SAR</p>
              <span class="prod-stock" [class.low-stock]="prod.stock < 30">المخزون: {{ prod.stock }} قطعة</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Approvals Modal -->
    <div class="dashboard-modal-layer" *ngIf="isApprovalsOpen">
      <div class="dashboard-modal-backdrop" (click)="closeApprovals.emit()"></div>
      <div class="dashboard-modal" dir="rtl">
        <header class="dashboard-modal__header">
          <h3>{{ 'DASHBOARD.AUTO_STR_14' | translate }}</h3>
          <button type="button" (click)="closeApprovals.emit()" class="dashboard-modal__close">
            <lucide-icon [img]="XIcon" [size]="18"></lucide-icon>
          </button>
        </header>

        <div class="dashboard-modal__body">
          <div class="dashboard-approvals-list">
            <ng-container *ngFor="let order of orders">
              <div class="dashboard-approval-item" *ngIf="order.paymentMethod === 'تحويل بنكي' || (order.paymentMethod || '').toLowerCase().includes('bank') || order.bankTransferReceipt">
                <div class="info">
                  <strong>طلب رقم: {{ order.orderNumber }}</strong>
                  <p>العميل: {{ order.customerName }} · المبلغ: {{ order.total }} SAR</p>
                  <span class="status" [class.is-paid]="order.paymentStatus === 'paid'">
                    {{ order.paymentStatus === 'paid' ? 'تم الاعتماد' : 'قيد المراجعة' }}
                  </span>
                </div>
                <div class="actions">
                  <button
                    type="button"
                    class="btn-approve"
                    *ngIf="order.paymentStatus !== 'paid'"
                    (click)="approveOrder.emit(order.id)"
                  >{{ 'DASHBOARD.AUTO_STR_304' | translate }}</button>
                </div>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Potential Customers Modal -->
    <div class="dashboard-modal-layer" *ngIf="isPotentialCustomersOpen">
      <div class="dashboard-modal-backdrop" (click)="closePotentialCustomers.emit()"></div>
      <div class="dashboard-modal" dir="rtl">
        <header class="dashboard-modal__header">
          <h3>{{ 'DASHBOARD.AUTO_STR_10' | translate }}</h3>
          <button type="button" (click)="closePotentialCustomers.emit()" class="dashboard-modal__close">
            <lucide-icon [img]="XIcon" [size]="18"></lucide-icon>
          </button>
        </header>
        <div class="dashboard-modal__body">
          <div class="dashboard-potential-list">
            <div class="dashboard-potential-item">
              <div>
                <strong>{{ 'DASHBOARD.AUTO_STR_368' | translate }}</strong>
                <p>هاتف: 0501234567 · سلة متروكة بقيمة 340 SAR</p>
              </div>
              <a href="https://wa.me/966501234567" target="_blank" class="dashboard-whatsapp-btn">
                <img src="assets/dashboard/whatsapp-button.png" alt="WhatsApp" />
              </a>
            </div>
            <div class="dashboard-potential-item">
              <div>
                <strong>{{ 'DASHBOARD.AUTO_STR_305' | translate }}</strong>
                <p>هاتف: 0559876543 · استفسار عن مقاسات المشد الحراري</p>
              </div>
              <a href="https://wa.me/966559876543" target="_blank" class="dashboard-whatsapp-btn">
                <img src="assets/dashboard/whatsapp-button.png" alt="WhatsApp" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Bulk Status Modal -->
    <div class="dashboard-modal-layer" *ngIf="isBulkStatusOpen">
      <div class="dashboard-modal-backdrop" (click)="closeBulkStatus.emit()"></div>
      <div class="dashboard-modal dashboard-modal--small" dir="rtl">
        <header class="dashboard-modal__header">
          <h3>{{ 'DASHBOARD.AUTO_STR_63' | translate }}</h3>
          <button type="button" (click)="closeBulkStatus.emit()" class="dashboard-modal__close">
            <lucide-icon [img]="XIcon" [size]="18"></lucide-icon>
          </button>
        </header>
        <div class="dashboard-modal__body">
          <p>اختر الحالة الجديدة لتطبيقها على جميع الطلبات المفلترة الحالية:</p>
          <select [(ngModel)]="bulkStatusTarget" class="dashboard-modal-select">
            <option value="confirmed">{{ 'DASHBOARD.AUTO_STR_381' | translate }}</option>
            <option value="preparing">{{ 'DASHBOARD.AUTO_STR_306' | translate }}</option>
            <option value="shipped">{{ 'COMMON.SHIPPED' | translate }}</option>
            <option value="out-for-delivery">{{ 'DASHBOARD.AUTO_STR_307' | translate }}</option>
            <option value="delivered">{{ 'DASHBOARD.AUTO_STR_341' | translate }}</option>
            <option value="postponed">{{ 'DASHBOARD.AUTO_STR_382' | translate }}</option>
          </select>
        </div>
        <footer class="dashboard-modal__footer">
          <button type="button" class="btn-cancel" (click)="closeBulkStatus.emit()">{{ 'COMMON.CANCEL' | translate }}</button>
          <button type="button" class="btn-confirm" (click)="confirmBulkStatus.emit(bulkStatusTarget)">{{ 'DASHBOARD.AUTO_STR_218' | translate }}</button>
        </footer>
      </div>
    </div>

    <!-- 5. Row Action Modal -->
    <div class="dashboard-modal-layer" *ngIf="rowActionDialog">
      <div class="dashboard-modal-backdrop" (click)="closeRowAction.emit()"></div>
      <div class="dashboard-modal" dir="rtl">
        <header class="dashboard-modal__header">
          <h3 *ngIf="rowActionDialog.kind === 'edit'">{{ 'DASHBOARD.AUTO_STR_112' | translate }}</h3>
          <h3 *ngIf="rowActionDialog.kind === 'status'">{{ 'DASHBOARD.AUTO_STR_156' | translate }}</h3>
          <h3 *ngIf="rowActionDialog.kind === 'payment'">{{ 'DASHBOARD.AUTO_STR_157' | translate }}</h3>
          <h3 *ngIf="rowActionDialog.kind === 'postpone'">{{ 'DASHBOARD.AUTO_STR_308' | translate }}</h3>
          <h3 *ngIf="rowActionDialog.kind === 'approve'">{{ 'DASHBOARD.AUTO_STR_64' | translate }}</h3>
          <button type="button" (click)="closeRowAction.emit()" class="dashboard-modal__close">
            <lucide-icon [img]="XIcon" [size]="18"></lucide-icon>
          </button>
        </header>

        <div class="dashboard-modal__body">
          <div class="dashboard-edit-form" *ngIf="rowActionDialog.kind === 'edit'">
            <div class="form-row">
              <label>
                <span>{{ 'CHECKOUT.CUSTOMER_NAME' | translate }}</span>
                <input type="text" [(ngModel)]="rowEditDraft.customerName" />
              </label>
              <label>
                <span>{{ 'CHECKOUT.PHONE' | translate }}</span>
                <input type="text" [(ngModel)]="rowEditDraft.phone" />
              </label>
            </div>
            <div class="form-row">
              <label>
                <span>{{ 'CHECKOUT.COUNTRY' | translate }}</span>
                <input type="text" [(ngModel)]="rowEditDraft.country" />
              </label>
              <label>
                <span>{{ 'CHECKOUT.CITY' | translate }}</span>
                <input type="text" [(ngModel)]="rowEditDraft.city" />
              </label>
              <label>
                <span>{{ 'DASHBOARD.AUTO_STR_393' | translate }}</span>
                <input type="text" [(ngModel)]="rowEditDraft.area" />
              </label>
            </div>
            <div class="form-row">
              <label class="full-width">
                <span>{{ 'COMMON.ADDRESS' | translate }}</span>
                <input type="text" [(ngModel)]="rowEditDraft.address" />
              </label>
            </div>
            <div class="form-row">
              <label>
                <span>{{ 'DASHBOARD.AUTO_STR_263' | translate }}</span>
                <select [(ngModel)]="rowEditDraft.deliveryCompany">
                  <option *ngFor="let c of deliveryCompanies" [value]="c">{{ c }}</option>
                </select>
              </label>
              <label>
                <span>{{ 'CHECKOUT.PAYMENT_METHOD' | translate }}</span>
                <select [(ngModel)]="rowEditDraft.paymentMethod">
                  <option *ngFor="let p of paymentMethods" [value]="p">{{ p }}</option>
                </select>
              </label>
            </div>
            <div class="form-row">
              <label class="full-width">
                <span>{{ 'CHECKOUT.NOTES' | translate }}</span>
                <textarea [(ngModel)]="rowEditDraft.notes" rows="2"></textarea>
              </label>
            </div>
          </div>

          <div *ngIf="rowActionDialog.kind === 'status'">
            <label class="block-label">
              <span>اختر الحالة الجديدة:</span>
              <select [(ngModel)]="rowActionValue" class="dashboard-modal-select">
                <option value="confirmed">{{ 'DASHBOARD.AUTO_STR_381' | translate }}</option>
                <option value="preparing">{{ 'DASHBOARD.AUTO_STR_306' | translate }}</option>
                <option value="shipped">{{ 'COMMON.SHIPPED' | translate }}</option>
                <option value="out-for-delivery">{{ 'DASHBOARD.AUTO_STR_307' | translate }}</option>
                <option value="delivered">{{ 'DASHBOARD.AUTO_STR_341' | translate }}</option>
                <option value="postponed">{{ 'DASHBOARD.AUTO_STR_382' | translate }}</option>
              </select>
            </label>
          </div>

          <div *ngIf="rowActionDialog.kind === 'payment'">
            <label class="block-label">
              <span>اختر حالة الدفع:</span>
              <select [(ngModel)]="rowActionValue" class="dashboard-modal-select">
                <option value="paid">{{ 'DASHBOARD.AUTO_STR_383' | translate }}</option>
                <option value="unpaid">{{ 'DASHBOARD.AUTO_STR_369' | translate }}</option>
              </select>
            </label>
          </div>

          <div *ngIf="rowActionDialog.kind === 'postpone'">
            <label class="block-label">
              <span>مدة التأجيل:</span>
              <select [(ngModel)]="rowActionValue" class="dashboard-modal-select">
                <option value="10">10 أيام</option>
                <option value="14">14 يوماً</option>
                <option value="30">30 يوماً</option>
                <option value="45">45 يوماً</option>
              </select>
            </label>
          </div>

          <div *ngIf="rowActionDialog.kind === 'approve'">
            <p>{{ 'DASHBOARD.AUTO_STR_8' | translate }}</p>
            <div *ngIf="selectedBankReceipt" class="bank-receipt-preview">
              <img [src]="selectedBankReceipt.receipt.dataUrl" alt="إيصال التحويل" />
            </div>
          </div>
        </div>

        <footer class="dashboard-modal__footer">
          <button type="button" class="btn-cancel" (click)="closeRowAction.emit()">{{ 'COMMON.CANCEL' | translate }}</button>
          <button type="button" class="btn-confirm" (click)="saveRowAction.emit({ draft: rowEditDraft, value: rowActionValue })">{{ 'DASHBOARD.AUTO_STR_342' | translate }}</button>
        </footer>
      </div>
    </div>
  `,
})
export class DashboardModalsComponent {
  readonly XIcon = X;

  @Input() catalogModal: 'products' | 'prices' | null = null;
  @Input() isApprovalsOpen = false;
  @Input() isPotentialCustomersOpen = false;
  @Input() isBulkStatusOpen = false;
  @Input() bulkStatusTarget: TrackedOrderStatus = 'confirmed';
  @Input() rowActionDialog: { orderId: string; kind: string } | null = null;
  @Input() rowEditDraft: any = {};
  @Input() rowActionValue = '';
  @Input() selectedBankReceipt: { orderNumber: string; receipt: BankTransferReceipt } | null = null;
  @Input() products: Product[] = [];
  @Input() orders: TrackedOrder[] = [];
  @Input() deliveryCompanies: string[] = [];
  @Input() paymentMethods: string[] = [];

  catalogSearch = '';

  @Output() closeCatalog = new EventEmitter<void>();
  @Output() closeApprovals = new EventEmitter<void>();
  @Output() closePotentialCustomers = new EventEmitter<void>();
  @Output() closeBulkStatus = new EventEmitter<void>();
  @Output() closeRowAction = new EventEmitter<void>();
  @Output() confirmBulkStatus = new EventEmitter<TrackedOrderStatus>();
  @Output() approveOrder = new EventEmitter<string>();
  @Output() saveRowAction = new EventEmitter<{ draft: any; value: string }>();

  get filteredCatalogProducts(): Product[] {
    const q = this.catalogSearch.trim().toLowerCase();
    if (!q) return this.products;
    return this.products.filter(p => p.nameAr.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q));
  }
}

