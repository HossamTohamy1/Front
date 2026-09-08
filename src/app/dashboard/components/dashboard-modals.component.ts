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
      <div class="dashboard-modal dashboard-modal--approvals" dir="rtl">
        <header class="dashboard-modal__header">
          <h3>{{ 'DASHBOARD.AUTO_STR_14' | translate }}</h3>
          <button type="button" (click)="closeApprovals.emit()" class="dashboard-modal__close">
            <lucide-icon [img]="XIcon" [size]="18"></lucide-icon>
          </button>
        </header>

        <div class="dashboard-modal__body">
          <div class="dashboard-approvals-list">
            <ng-container *ngFor="let order of orders">
              <div class="dashboard-approval-item" *ngIf="isBankOrder(order)">
                <div class="approval-card-main">
                  <div class="info">
                    <div class="info-top">
                      <strong class="order-num">طلب رقم: {{ order.orderNumber }}</strong>
                      <span class="status" [class.is-paid]="order.paymentStatus === 'paid'">
                        {{ order.paymentStatus === 'paid' ? ('DASHBOARD.AUTO_STR_303' | translate) : ('DASHBOARD.AUTO_STR_262' | translate) }}
                      </span>
                    </div>
                    <p class="customer-info">العميل: <strong>{{ order.customerName }}</strong> · الهاتف: {{ order.phone }}</p>
                    <p class="amount-info">المبلغ: <span class="price-highlight">{{ order.total }} SAR</span></p>
                  </div>

                  <div class="receipt-preview-box" *ngIf="order.bankTransferReceipt?.dataUrl">
                    <a [href]="order.bankTransferReceipt?.dataUrl" target="_blank" title="عرض الإيصال بالحجم الكامل">
                      <img [src]="order.bankTransferReceipt?.dataUrl" alt="إيصال التحويل" class="receipt-thumb-img" />
                      <span class="receipt-view-hint">تكبير الإيصال ↗</span>
                    </a>
                  </div>
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

            <div class="dashboard-approvals-empty" *ngIf="!hasBankOrders()">
              <p>لا توجد تحويلات بنكية معلقة حالياً.</p>
            </div>
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

    <!-- 6. Dedicated Bank Receipt Modal -->
    <div class="dashboard-modal-layer" *ngIf="selectedBankReceipt && !rowActionDialog">
      <div class="dashboard-modal-backdrop" (click)="selectedBankReceipt = null"></div>
      <div class="dashboard-modal dashboard-modal--receipt" dir="rtl">
        <header class="dashboard-modal__header">
          <h3>إيصال تحويل الطلب {{ selectedBankReceipt.orderNumber }}</h3>
          <button type="button" (click)="selectedBankReceipt = null" class="dashboard-modal__close">
            <lucide-icon [img]="XIcon" [size]="18"></lucide-icon>
          </button>
        </header>
        <div class="dashboard-modal__body receipt-full-body">
          <img [src]="selectedBankReceipt.receipt.dataUrl" [alt]="'إيصال تحويل ' + selectedBankReceipt.orderNumber" class="large-receipt-img" />
        </div>
        <footer class="dashboard-modal__footer">
          <a [href]="selectedBankReceipt.receipt.dataUrl" target="_blank" class="btn-confirm">فتح في نافذة جديدة ↗</a>
          <button type="button" class="btn-cancel" (click)="selectedBankReceipt = null">إغلاق</button>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-modal-layer {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .dashboard-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(4px);
    }
    .dashboard-modal {
      position: relative;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: 100%;
      max-width: 580px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.96) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .dashboard-modal--catalog {
      max-width: 800px;
    }
    .dashboard-modal--approvals {
      max-width: 650px;
    }
    .dashboard-modal--receipt {
      max-width: 650px;
    }
    .dashboard-modal__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 24px;
      border-bottom: 1px solid #f1f5f9;
      background: #fafafa;
    }
    .dashboard-modal__header h3 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
    }
    .dashboard-modal__close {
      background: #f1f5f9;
      border: none;
      border-radius: 8px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748b;
      transition: all 0.15s;
    }
    .dashboard-modal__close:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
    .dashboard-modal__body {
      padding: 20px 24px;
      overflow-y: auto;
      flex: 1;
    }
    .dashboard-modal__footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #f1f5f9;
      background: #fafafa;
    }
    .btn-cancel {
      padding: 9px 18px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #475569;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-cancel:hover {
      background: #f8fafc;
    }
    .btn-confirm {
      padding: 9px 20px;
      border-radius: 8px;
      border: none;
      background: #0ea5e9;
      color: #ffffff;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      transition: all 0.15s;
    }
    .btn-confirm:hover {
      background: #0284c7;
    }
    .dashboard-approvals-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .dashboard-approval-item {
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      transition: border-color 0.2s;
    }
    .dashboard-approval-item:hover {
      border-color: #cbd5e1;
    }
    .approval-card-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }
    .info-top {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 6px;
    }
    .order-num {
      font-size: 1rem;
      color: #0f172a;
      font-weight: 700;
    }
    .status {
      font-size: 0.75rem;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 600;
      background: #fef3c7;
      color: #b45309;
    }
    .status.is-paid {
      background: #dcfce7;
      color: #15803d;
    }
    .customer-info {
      margin: 4px 0;
      color: #334155;
      font-size: 0.9rem;
    }
    .amount-info {
      margin: 4px 0;
      color: #64748b;
      font-size: 0.9rem;
    }
    .price-highlight {
      color: #0ea5e9;
      font-weight: 700;
      font-size: 1rem;
    }
    .receipt-preview-box {
      flex-shrink: 0;
      text-align: center;
    }
    .receipt-preview-box a {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      gap: 4px;
    }
    .receipt-thumb-img {
      width: 72px;
      height: 72px;
      object-fit: cover;
      border-radius: 8px;
      border: 2px solid #e2e8f0;
      transition: transform 0.15s, border-color 0.15s;
    }
    .receipt-thumb-img:hover {
      transform: scale(1.05);
      border-color: #0ea5e9;
    }
    .receipt-view-hint {
      font-size: 0.7rem;
      color: #0ea5e9;
      font-weight: 600;
    }
    .btn-approve {
      width: 100%;
      padding: 10px 16px;
      border-radius: 8px;
      border: none;
      background: #10b981;
      color: #ffffff;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-approve:hover {
      background: #059669;
    }
    .dashboard-approvals-empty {
      text-align: center;
      padding: 32px 16px;
      color: #94a3b8;
      font-size: 0.95rem;
    }
    .receipt-full-body {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .large-receipt-img {
      max-width: 100%;
      max-height: 65vh;
      object-fit: contain;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .dashboard-modal-select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      margin-top: 6px;
    }
    .dashboard-modal-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      margin-top: 6px;
    }
    .dashboard-modal-textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      margin-top: 6px;
      resize: vertical;
    }
    .dashboard-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .dashboard-potential-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .dashboard-potential-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
    }
    .dashboard-catalog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    .dashboard-catalog-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .dashboard-catalog-card img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      border-radius: 6px;
    }
    .dashboard-search-input input {
      width: 100%;
      padding: 8px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
    }
  `]
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

  isBankOrder(order: TrackedOrder): boolean {
    if (!order) return false;
    const pm = (order.paymentMethod || '').toLowerCase();
    return pm.includes('تحويل') || pm.includes('bank') || pm.includes('bank_transfer') || !!order.bankTransferReceipt;
  }

  hasBankOrders(): boolean {
    return (this.orders || []).some(o => this.isBankOrder(o));
  }

  get filteredCatalogProducts(): Product[] {
    const q = this.catalogSearch.trim().toLowerCase();
    if (!q) return this.products;
    return this.products.filter(p => p.nameAr.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q));
  }
}

