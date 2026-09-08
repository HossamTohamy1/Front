import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { SectionCardComponent } from '../components/section-card/section-card.component';
import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Trash2 } from 'lucide-angular';
import { CheckoutPageConfigService, CheckoutPageConfig } from '../../../../core/services/page-configs/checkout-page-config.service';

@Component({
  selector: 'app-checkout-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule, SectionCardComponent],
  
  template: `
        <div class="w-full flex flex-col gap-2 pb-24" dir="rtl">
            <div class="text-center mb-4">
                <h2 class="text-xl font-bold text-gray-900 mb-1">{{ 'CART.CHECKOUT' | translate }}</h2>
                <p class="text-sm text-gray-500">{{ 'DASHBOARD.AUTO_STR_24' | translate }}</p>
            </div>

            <app-section-card title='DASHBOARD.AUTO_STR_353' [index]="0" [enabled]="true" [isFirst]="true" [isLast]="false" (toggle)="noop()" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
                <div class="flex flex-col gap-1.5 mb-3">
                    <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_178' | translate }}</span>
                    <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().headerTitle" (ngModelChange)="updateConfig({ headerTitle: $event })" />
                </div>
                <div class="flex flex-col gap-1.5 mb-3">
                    <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_316' | translate }}</span>
                    <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().headerSubtitle" (ngModelChange)="updateConfig({ headerSubtitle: $event })" />
                </div>
            </app-section-card>

            <app-section-card title='DASHBOARD.AUTO_STR_180' [index]="1" [enabled]="true" [isFirst]="false" [isLast]="false" (toggle)="noop()" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
                <div class="flex flex-col gap-1.5 mb-3">
                    <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_163' | translate }}</span>
                    <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().customerInfoTitle" (ngModelChange)="updateConfig({ customerInfoTitle: $event })" />
                </div>
                <div class="flex flex-col gap-1.5 mb-3">
                    <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_181' | translate }}</span>
                    <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().paymentInfoTitle" (ngModelChange)="updateConfig({ paymentInfoTitle: $event })" />
                </div>
                <div class="flex flex-col gap-1.5 mb-3">
                    <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_278' | translate }}</span>
                    <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().summaryTitle" (ngModelChange)="updateConfig({ summaryTitle: $event })" />
                </div>
                <div class="flex items-center gap-2 mb-2 mt-4">
                    <input type="checkbox" [ngModel]="config().showSafeShopping" (ngModelChange)="updateConfig({showSafeShopping: $event})" class="rounded text-blue-600 focus:ring-blue-500" />
                    <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_57' | translate }}</span>
                </div>
                <div class="flex flex-col gap-1.5 mb-3">
                    <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_115' | translate }}</span>
                    <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().safeShoppingTitle" (ngModelChange)="updateConfig({ safeShoppingTitle: $event })" />
                </div>
                <div class="flex flex-col gap-1.5 mb-3">
                    <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_182' | translate }}</span>
                    <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().safeShoppingText" (ngModelChange)="updateConfig({ safeShoppingText: $event })" />
                </div>
            </app-section-card>
            
            <app-section-card title='DASHBOARD.AUTO_STR_116' [index]="2" [enabled]="true" [isFirst]="false" [isLast]="false" (toggle)="noop()" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
                <div class="flex flex-col gap-1.5 mb-3">
                    <span class="text-xs font-bold text-gray-700">{{ 'COMMON.ADDRESS' | translate }}</span>
                    <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().emptyStateTitle" (ngModelChange)="updateConfig({ emptyStateTitle: $event })" />
                </div>
                <div class="flex flex-col gap-1.5 mb-3">
                    <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_449' | translate }}</span>
                    <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().emptyStateText" (ngModelChange)="updateConfig({ emptyStateText: $event })" />
                </div>
                <div class="flex flex-col gap-1.5 mb-3">
                    <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_275' | translate }}</span>
                    <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().emptyStateCta" (ngModelChange)="updateConfig({ emptyStateCta: $event })" />
                </div>
            </app-section-card>

            <app-section-card title='DASHBOARD.AUTO_STR_232' [index]="3" [enabled]="config().showTrustBadges" [isFirst]="false" [isLast]="true" (toggle)="updateConfig({showTrustBadges: $event})" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()" [addAction]="{ label: 'DASHBOARD.AUTO_STR_356', onClick: addTrustBadge.bind(this) }">
                <div class="flex flex-col gap-3 mt-3">
                    <div *ngFor="let badge of config().trustBadges; let idx = index" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div class="flex flex-col gap-2 flex-1">
                            <input type="text" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="badge.title" (ngModelChange)="updateTrustBadge(idx, { title: $event })" placeholder='COMMON.ADDRESS' />
                            <input type="text" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="badge.subtitle" (ngModelChange)="updateTrustBadge(idx, { subtitle: $event })" placeholder='DASHBOARD.AUTO_STR_279' />
                            <select class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="badge.icon" (ngModelChange)="updateTrustBadge(idx, { icon: $event })">
                                <option value="BadgeCheck">شارة صح (BadgeCheck)</option>
                                <option value="Truck">شاحنة (Truck)</option>
                                <option value="RotateCcw">إرجاع (RotateCcw)</option>
                                <option value="ShieldCheck">درع صح (ShieldCheck)</option>
                            </select>
                        </div>
                        <button (click)="removeTrustBadge(idx)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md h-fit">
                            <lucide-icon name="trash-2" [img]="Trash2" size="16"></lucide-icon>
                        </button>
                    </div>
                </div>
            </app-section-card>
        </div>
  `
})
export class CheckoutPageEditorComponent {
  private configService = inject(CheckoutPageConfigService);
  config = this.configService.pageConfig;
  Trash2 = Trash2;

  updateConfig(updates: Partial<CheckoutPageConfig>) {
    this.configService.updateConfig({ ...this.config(), ...updates });
  }

  addTrustBadge() {
    const badges = [...(this.config().trustBadges || [])];
    badges.push({ id: 'tb-' + Date.now(), icon: 'BadgeCheck', title: 'DASHBOARD.AUTO_STR_350', subtitle: 'DASHBOARD.AUTO_STR_387' });
    this.updateConfig({ trustBadges: badges });
  }

  updateTrustBadge(index: number, updates: any) {
    const badges = [...(this.config().trustBadges || [])];
    badges[index] = { ...badges[index], ...updates };
    this.updateConfig({ trustBadges: badges });
  }

  removeTrustBadge(index: number) {
    const badges = [...(this.config().trustBadges || [])];
    badges.splice(index, 1);
    this.updateConfig({ trustBadges: badges });
  }

  noop() {}
}
