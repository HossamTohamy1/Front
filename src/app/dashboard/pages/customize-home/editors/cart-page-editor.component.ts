import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CartPageConfigService } from '../../../../core/services/page-configs/cart-page-config.service';
import { SectionCardComponent } from '../components/section-card/section-card.component';
import { AddItemButtonComponent } from '../components/add-item-button/add-item-button.component';

@Component({
  selector: 'app-cart-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule, SectionCardComponent, AddItemButtonComponent],
  template: `
    <div class="w-full flex flex-col gap-2 pb-24" dir="rtl">
      <div class="text-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 mb-1">{{ 'CART.TITLE' | translate }}</h2>
        <p class="text-sm text-gray-500">{{ 'DASHBOARD.AUTO_STR_16' | translate }}</p>
      </div>

      <app-section-card title='DASHBOARD.AUTO_STR_353' [index]="0" [enabled]="true" [isFirst]="true" [isLast]="false"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" (toggle)="$event">
        <div class="flex flex-col gap-1.5 mb-2">
          <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_276' | translate }}</span>
          <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" 
            [ngModel]="config().headerTitle" (ngModelChange)="updateConfig({ headerTitle: $event })" />
        </div>
      </app-section-card>

      <app-section-card title='DASHBOARD.AUTO_STR_319' [index]="1" [enabled]="true" [isFirst]="false" [isLast]="false"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" (toggle)="$event">
        <div class="grid grid-cols-2 gap-2">
          <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'DASHBOARD.AUTO_STR_136', field: 'showProductImage' }"></ng-container>
          <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'DASHBOARD.AUTO_STR_277', field: 'showQuantityControls' }"></ng-container>
          <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'DASHBOARD.AUTO_STR_389', field: 'showRemoveButton' }"></ng-container>
          <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'DASHBOARD.AUTO_STR_179', field: 'showOldPrice' }"></ng-container>
        </div>
      </app-section-card>

      <app-section-card title='CART.DISCOUNT_CODE' [index]="2" [enabled]="config().showCouponSection" [isFirst]="false" [isLast]="false"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" (toggle)="updateConfig({ showCouponSection: $event })">
        <div class="flex flex-col gap-2">
          <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'DASHBOARD.AUTO_STR_317', field: 'couponTitle' }"></ng-container>
          <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'النص الإرشادي (Placeholder)', field: 'couponPlaceholder' }"></ng-container>
          <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'DASHBOARD.AUTO_STR_228', field: 'couponButtonText' }"></ng-container>
        </div>
      </app-section-card>

      <app-section-card title='CHECKOUT.ORDER_SUMMARY' [index]="3" [enabled]="true" [isFirst]="false" [isLast]="false"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" (toggle)="$event">
        <div class="grid grid-cols-2 gap-2">
          <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'COMMON.SUBTOTAL', field: 'showSubtotal' }"></ng-container>
          <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'DASHBOARD.AUTO_STR_354', field: 'showShipping' }"></ng-container>
          <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'DASHBOARD.AUTO_STR_428', field: 'showDiscount' }"></ng-container>
          <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'CART.TOTAL', field: 'showTotal' }"></ng-container>
        </div>
        <div class="mt-4">
          <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'DASHBOARD.AUTO_STR_137', field: 'checkoutButtonText' }"></ng-container>
        </div>
      </app-section-card>

      <app-section-card title='DASHBOARD.AUTO_STR_229' [index]="4" [enabled]="true" [isFirst]="false" [isLast]="false"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" (toggle)="$event">
        <div class="flex flex-col gap-2">
          <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'DASHBOARD.AUTO_STR_80', field: 'emptyCartIllustration' }"></ng-container>
          <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'DASHBOARD.AUTO_STR_162', field: 'emptyCartText' }"></ng-container>
        </div>
      </app-section-card>

      <app-section-card title='DASHBOARD.AUTO_STR_320' [index]="5" [enabled]="config().showTrustBadges" [isFirst]="false" [isLast]="true"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" addActionLabel='DASHBOARD.AUTO_STR_355' (onAddAction)="addTrustBadge()"
        (toggle)="updateConfig({ showTrustBadges: $event })">
        <div class="flex flex-col gap-2">
          <div *ngFor="let badge of config().trustBadges; let idx = index" class="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-lg p-2">
            <div class="flex flex-col gap-2 flex-1">
              <input type="text" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" 
                [ngModel]="badge.title" (ngModelChange)="updateTrustBadge(idx, { title: $event })" placeholder='COMMON.ADDRESS' />
              <input type="text" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-500" 
                [ngModel]="badge.subtitle" (ngModelChange)="updateTrustBadge(idx, { subtitle: $event })" placeholder='PRODUCT.DESCRIPTION' />
            </div>
            <button (click)="removeTrustBadge(idx)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"><lucide-icon name="trash-2" [size]="16"></lucide-icon></button>
          </div>
        </div>
      </app-section-card>

      <ng-template #checkboxTemplate let-label="label" let-field="field">
        <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
          <span class="text-sm text-gray-700">{{ label }}</span>
          <div class="relative inline-flex items-center">
            <input type="checkbox" class="sr-only peer" [checked]="!!getConfigValue(field)" (change)="updateConfigField(field, $any($event.target).checked)" />
            <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </div>
        </label>
      </ng-template>

      <ng-template #textInputTemplate let-label="label" let-field="field">
        <div class="flex flex-col gap-1.5 mb-2">
          <span class="text-xs font-bold text-gray-700">{{ label }}</span>
          <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" 
            [ngModel]="getConfigValue(field)" (ngModelChange)="updateConfigField(field, $event)" />
        </div>
      </ng-template>
    </div>
  `
})
export class CartPageEditorComponent {
  private configService = inject(CartPageConfigService);
  config = this.configService.pageConfig;

  updateConfig(updates: Partial<any>) {
    this.configService.updateConfig({ ...this.config(), ...updates });
  }

  getConfigValue(field: string): any {
    return (this.config() as any)[field];
  }

  updateConfigField(field: string, value: any) {
    this.updateConfig({ [field]: value });
  }

  addTrustBadge() {
    const badges = [...this.config().trustBadges];
    badges.push({ id: 't-' + Date.now(), icon: 'BadgeCheck', title: 'DASHBOARD.AUTO_STR_350', subtitle: 'DASHBOARD.AUTO_STR_230' });
    this.updateConfig({ trustBadges: badges });
  }

  updateTrustBadge(index: number, updates: any) {
    const badges = [...this.config().trustBadges];
    badges[index] = { ...badges[index], ...updates };
    this.updateConfig({ trustBadges: badges });
  }

  removeTrustBadge(index: number) {
    const badges = [...this.config().trustBadges];
    badges.splice(index, 1);
    this.updateConfig({ trustBadges: badges });
  }
}
