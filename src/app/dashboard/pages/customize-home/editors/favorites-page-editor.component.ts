import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoritesPageConfigService } from '../../../../core/services/page-configs/favorites-page-config.service';
import { SectionCardComponent } from '../components/section-card/section-card.component';
import { LucideAngularModule, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-favorites-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, SectionCardComponent, LucideAngularModule],
  template: `
    <div class="w-full flex flex-col gap-2 pb-24" dir="rtl">
        <div class="text-center mb-4">
            <h2 class="text-xl font-bold text-gray-900 mb-1">{{ 'DASHBOARD.AUTO_STR_280' | translate }}</h2>
            <p class="text-sm text-gray-500">{{ 'DASHBOARD.AUTO_STR_18' | translate }}</p>
        </div>

        <app-section-card title="رأس الصفحة والأدوات" [index]="0" [enabled]="config().showTitle" [isFirst]="true" [isLast]="false" (toggle)="updateConfig({showTitle: $event})">
            <div class="flex flex-col gap-1.5 mb-3">
                <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_178' | translate }}</span>
                <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().headerTitle" (ngModelChange)="updateConfig({headerTitle: $event})" />
            </div>
            <div class="flex flex-col gap-1.5 mb-3">
                <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_316' | translate }}</span>
                <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().headerSubtitle" (ngModelChange)="updateConfig({headerSubtitle: $event})" />
            </div>
            
            <hr class="my-3 border-gray-100" />
            
            <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors mb-2">
                <span class="text-sm text-gray-700">{{ 'DASHBOARD.AUTO_STR_117' | translate }}</span>
                <div class="relative inline-flex items-center">
                    <input type="checkbox" class="sr-only peer" [ngModel]="config().showToolbar" (ngModelChange)="updateConfig({showToolbar: $event})" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </div>
            </label>
            <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors mb-2">
                <span class="text-sm text-gray-700">{{ 'DASHBOARD.AUTO_STR_81' | translate }}</span>
                <div class="relative inline-flex items-center">
                    <input type="checkbox" class="sr-only peer" [ngModel]="config().showSort" (ngModelChange)="updateConfig({showSort: $event})" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </div>
            </label>
            <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors mb-2">
                <span class="text-sm text-gray-700">{{ 'DASHBOARD.AUTO_STR_118' | translate }}</span>
                <div class="relative inline-flex items-center">
                    <input type="checkbox" class="sr-only peer" [ngModel]="config().showCount" (ngModelChange)="updateConfig({showCount: $event})" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </div>
            </label>
            
            <hr class="my-3 border-gray-100" />
            
            <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors mb-2">
                <span class="text-sm text-gray-700">{{ 'DASHBOARD.AUTO_STR_36' | translate }}</span>
                <div class="relative inline-flex items-center">
                    <input type="checkbox" class="sr-only peer" [ngModel]="config().showAddAllToCart" (ngModelChange)="updateConfig({showAddAllToCart: $event})" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </div>
            </label>
            <div class="flex flex-col gap-1.5 mb-3">
                <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_58' | translate }}</span>
                <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().addAllToCartText" (ngModelChange)="updateConfig({addAllToCartText: $event})" />
            </div>
        </app-section-card>

        <app-section-card title="بطاقة المنتج" [index]="1" [enabled]="true" [isFirst]="false" [isLast]="false">
            <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors mb-2">
                <span class="text-sm text-gray-700">{{ 'DASHBOARD.AUTO_STR_327' | translate }}</span>
                <div class="relative inline-flex items-center">
                    <input type="checkbox" class="sr-only peer" [ngModel]="config().showProductColor" (ngModelChange)="updateConfig({showProductColor: $event})" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </div>
            </label>
            <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors mb-2">
                <span class="text-sm text-gray-700">{{ 'DASHBOARD.AUTO_STR_282' | translate }}</span>
                <div class="relative inline-flex items-center">
                    <input type="checkbox" class="sr-only peer" [ngModel]="config().showProductSize" (ngModelChange)="updateConfig({showProductSize: $event})" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </div>
            </label>
            <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors mb-2">
                <span class="text-sm text-gray-700">{{ 'DASHBOARD.AUTO_STR_119' | translate }}</span>
                <div class="relative inline-flex items-center">
                    <input type="checkbox" class="sr-only peer" [ngModel]="config().showProductPrice" (ngModelChange)="updateConfig({showProductPrice: $event})" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </div>
            </label>
            <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors mb-2">
                <span class="text-sm text-gray-700">إظهار السعر القديم (قبل الخصم)</span>
                <div class="relative inline-flex items-center">
                    <input type="checkbox" class="sr-only peer" [ngModel]="config().showProductOldPrice" (ngModelChange)="updateConfig({showProductOldPrice: $event})" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </div>
            </label>
            <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors mb-2">
                <span class="text-sm text-gray-700">{{ 'DASHBOARD.AUTO_STR_139' | translate }}</span>
                <div class="relative inline-flex items-center">
                    <input type="checkbox" class="sr-only peer" [ngModel]="config().showProductStock" (ngModelChange)="updateConfig({showProductStock: $event})" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </div>
            </label>
            <hr class="my-3 border-gray-100" />
            <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors mb-2">
                <span class="text-sm text-gray-700">{{ 'DASHBOARD.AUTO_STR_204' | translate }}</span>
                <div class="relative inline-flex items-center">
                    <input type="checkbox" class="sr-only peer" [ngModel]="config().showRemoveAction" (ngModelChange)="updateConfig({showRemoveAction: $event})" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </div>
            </label>
            <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors mb-2">
                <span class="text-sm text-gray-700">{{ 'DASHBOARD.AUTO_STR_82' | translate }}</span>
                <div class="relative inline-flex items-center">
                    <input type="checkbox" class="sr-only peer" [ngModel]="config().showMoveToCartAction" (ngModelChange)="updateConfig({showMoveToCartAction: $event})" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </div>
            </label>
        </app-section-card>

        <app-section-card title="حالة المفضلة الفارغة" [index]="2" [enabled]="true" [isFirst]="false" [isLast]="false">
            <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors mb-2">
                <span class="text-sm text-gray-700">إظهار الرسم التوضيحي (Illustration)</span>
                <div class="relative inline-flex items-center">
                    <input type="checkbox" class="sr-only peer" [ngModel]="config().showEmptyStateIllustration" (ngModelChange)="updateConfig({showEmptyStateIllustration: $event})" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </div>
            </label>
            <div class="flex flex-col gap-1.5 mb-3">
                <span class="text-xs font-bold text-gray-700">{{ 'COMMON.ADDRESS' | translate }}</span>
                <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().emptyStateTitle" (ngModelChange)="updateConfig({emptyStateTitle: $event})" />
            </div>
            <div class="flex flex-col gap-1.5 mb-3">
                <span class="text-xs font-bold text-gray-700">{{ 'PRODUCT.DESCRIPTION' | translate }}</span>
                <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().emptyStateSubtitle" (ngModelChange)="updateConfig({emptyStateSubtitle: $event})" />
            </div>
            <div class="flex flex-col gap-1.5 mb-3">
                <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_283' | translate }}</span>
                <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().emptyStateButtonText" (ngModelChange)="updateConfig({emptyStateButtonText: $event})" />
            </div>
        </app-section-card>

        <app-section-card title="مميزات التسوق" [index]="3" [enabled]="config().showTrustBadges" [isFirst]="false" [isLast]="true" (toggle)="updateConfig({showTrustBadges: $event})" [addAction]="{ label: 'إضافة ميزة', onClick: addBadge }">
            <div class="flex flex-col gap-3">
                <div *ngFor="let badge of config().trustBadges; let idx = index; trackBy: trackById" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div class="flex flex-col gap-2 flex-1">
                        <input type="text" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="badge.title" (ngModelChange)="updateBadge(idx, { title: $event })" placeholder="العنوان" />
                        <input type="text" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-600" [ngModel]="badge.subtitle" (ngModelChange)="updateBadge(idx, { subtitle: $event })" placeholder="الوصف القصير" />
                        <select class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="badge.icon" (ngModelChange)="updateBadge(idx, { icon: $event })">
                            <option value="BadgeCheck">شارة توثيق (BadgeCheck)</option>
                            <option value="Truck">سيارة شحن (Truck)</option>
                            <option value="RotateCcw">استرجاع (RotateCcw)</option>
                            <option value="ShieldCheck">درع حماية (ShieldCheck)</option>
                        </select>
                    </div>
                    <button (click)="removeBadge(idx)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md h-fit">
                        <lucide-icon name="trash-2" [size]="16"></lucide-icon>
                    </button>
                </div>
            </div>
        </app-section-card>
    </div>
  `
})
export class FavoritesPageEditorComponent {
  favoritesService = inject(FavoritesPageConfigService);
  config = this.favoritesService.pageConfig;
  Trash2 = Trash2;

  addBadge = () => {
      const badges = [...(this.config().trustBadges || [])];
      badges.push({ id: 'b-' + Date.now(), icon: 'ShieldCheck', title: 'ميزة جديدة', subtitle: 'وصف قصير' });
      this.updateConfig({ trustBadges: badges });
  };

  updateConfig(updates: Partial<ReturnType<typeof this.config>>) {
      this.favoritesService.updateConfig({ ...this.config(), ...updates } as any);
  }

  updateBadge(index: number, updates: any) {
      const badges = [...(this.config().trustBadges || [])];
      badges[index] = { ...badges[index], ...updates };
      this.updateConfig({ trustBadges: badges });
  }

  removeBadge(index: number) {
      const badges = [...(this.config().trustBadges || [])];
      badges.splice(index, 1);
      this.updateConfig({ trustBadges: badges });
  }

  trackById(index: number, item: any): string {
    return item.id;
  }
}
