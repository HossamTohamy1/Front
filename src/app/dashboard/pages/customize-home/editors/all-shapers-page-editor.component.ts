import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllShapersPageConfigService } from '../../../../core/services/page-configs/all-shapers-page-config.service';
import { SectionCardComponent } from '../components/section-card/section-card.component';

@Component({
  selector: 'app-all-shapers-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, SectionCardComponent],
  template: `
    <div class="w-full flex flex-col gap-2 pb-24" dir="rtl">
      <div class="text-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 mb-1">{{ 'DASHBOARD.AUTO_STR_226' | translate }}</h2>
        <p class="text-sm text-gray-500">إدارة صفحة 'كل المشدات'</p>
      </div>

      <app-section-card title="رأس الصفحة" [index]="0" [enabled]="true" [isFirst]="true" [isLast]="false"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" (toggle)="$event">
        <div class="flex flex-col gap-1.5 mb-3">
          <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_178' | translate }}</span>
          <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" 
            [ngModel]="config().headerTitle" (ngModelChange)="updateConfig({ headerTitle: $event })" />
        </div>
      </app-section-card>

      <app-section-card title="تفاصيل بطاقة المنتج" [index]="1" [enabled]="true" [isFirst]="false" [isLast]="false"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" (toggle)="$event">
        <div class="flex items-center gap-2 mb-2">
          <input type="checkbox" [ngModel]="config().showRating" (ngModelChange)="updateConfig({ showRating: $event })" class="rounded text-blue-600 focus:ring-blue-500" />
          <span class="text-sm font-medium">إظهار النجوم (التقييم)</span>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <input type="checkbox" [ngModel]="config().showReviewsCount" (ngModelChange)="updateConfig({ showReviewsCount: $event })" class="rounded text-blue-600 focus:ring-blue-500" />
          <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_99' | translate }}</span>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <input type="checkbox" [ngModel]="config().showOriginalPrice" (ngModelChange)="updateConfig({ showOriginalPrice: $event })" class="rounded text-blue-600 focus:ring-blue-500" />
          <span class="text-sm font-medium">إظهار السعر قبل الخصم (إذا وُجد)</span>
        </div>
      </app-section-card>

      <app-section-card title="حالة عدم وجود نتائج" [index]="2" [enabled]="true" [isFirst]="false" [isLast]="true"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" (toggle)="$event">
        <div class="flex flex-col gap-1.5 mb-3">
          <span class="text-xs font-bold text-gray-700">{{ 'COMMON.ADDRESS' | translate }}</span>
          <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" 
            [ngModel]="config().emptyTitle" (ngModelChange)="updateConfig({ emptyTitle: $event })" />
        </div>
        <div class="flex flex-col gap-1.5 mb-3">
          <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_449' | translate }}</span>
          <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" 
            [ngModel]="config().emptyText" (ngModelChange)="updateConfig({ emptyText: $event })" />
        </div>
        <div class="flex flex-col gap-1.5 mb-3">
          <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_275' | translate }}</span>
          <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" 
            [ngModel]="config().emptyCta" (ngModelChange)="updateConfig({ emptyCta: $event })" />
        </div>
      </app-section-card>
    </div>
  `
})
export class AllShapersPageEditorComponent {
  private configService = inject(AllShapersPageConfigService);
  config = this.configService.pageConfig;

  updateConfig(updates: Partial<any>) {
    this.configService.updateConfig({ ...this.config(), ...updates });
  }
}
