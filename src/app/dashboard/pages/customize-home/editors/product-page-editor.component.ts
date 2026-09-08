import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductPageConfigService } from '../../../../core/services/page-configs/product-page-config.service';
import { Trash2 } from 'lucide-angular';
import { SectionCardComponent } from '../components/section-card/section-card.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-product-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule, SectionCardComponent],
  template: `
    <div class="w-full flex flex-col gap-2 pb-24" dir="rtl">
      <div class="text-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 mb-1">{{ 'DASHBOARD.AUTO_STR_247' | translate }}</h2>
        <p class="text-sm text-gray-500">{{ 'DASHBOARD.AUTO_STR_12' | translate }}</p>
      </div>

      <app-section-card title="الرأس ومعلومات المنتج" [index]="0" [enabled]="true" [isFirst]="true" [isLast]="false" (toggle)="noop()" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار مسار التنقل (Breadcrumb)', field: 'showBreadcrumb' }"></ng-container>
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار علامة الأكثر مبيعاً', field: 'showBestSellerBadge' }"></ng-container>
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'نص علامة الأكثر مبيعاً', field: 'bestSellerText' }"></ng-container>
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار سطر التقييم', field: 'showRatingLine' }"></ng-container>
      </app-section-card>

      <app-section-card title="خيارات الشراء" [index]="1" [enabled]="true" [isFirst]="false" [isLast]="false" (toggle)="noop()" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار خيارات الألوان', field: 'showColorOptions' }"></ng-container>
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'تسمية اللون', field: 'colorLabel' }"></ng-container>
        <hr class="my-3 border-gray-100" />
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار خيارات المقاسات', field: 'showSizeOptions' }"></ng-container>
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'تسمية المقاس', field: 'sizeLabel' }"></ng-container>
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'نص دليل المقاسات', field: 'sizeGuideText' }"></ng-container>
        <hr class="my-3 border-gray-100" />
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار أزرار الشراء', field: 'showPurchaseActions' }"></ng-container>
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'نص زر إضافة للسلة', field: 'addToCartText' }"></ng-container>
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'نص زر الشراء السريع', field: 'buyNowText' }"></ng-container>
      </app-section-card>

      <app-section-card title="مميزات الخدمة (أسفل الشراء)" [index]="2" [enabled]="config().showServiceRow" [isFirst]="false" [isLast]="false" (toggle)="updateConfig({showServiceRow: $event})" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()" [addAction]="{ label: 'إضافة ميزة', onClick: addService.bind(this) }">
        <div class="flex flex-col gap-3">
          <div *ngFor="let svc of config().services || []; let idx = index" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div class="flex flex-col gap-2 flex-1">
              <input type="text" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="svc.text" (ngModelChange)="updateService(idx, { text: $event })" placeholder="نص الخدمة" />
              <select class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="svc.icon" (ngModelChange)="updateService(idx, { icon: $event })">
                <option value="Truck">سيارة شحن (Truck)</option>
                <option value="RotateCcw">استرجاع (RotateCcw)</option>
                <option value="ShieldCheck">درع حماية (ShieldCheck)</option>
                <option value="BadgeCheck">شارة (BadgeCheck)</option>
              </select>
            </div>
            <button (click)="removeService(idx)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md h-fit">
              <lucide-icon name="trash-2" [size]="16"></lucide-icon>
            </button>
          </div>
        </div>
      </app-section-card>

      <app-section-card title="محتوى التفاصيل (التبويبات)" [index]="3" [enabled]="config().showTabs" [isFirst]="false" [isLast]="false" (toggle)="updateConfig({showTabs: $event})" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'عنوان تبويب الوصف', field: 'tabDescriptionText' }"></ng-container>
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار محتوى الوصف', field: 'showDescriptionSection' }"></ng-container>
        <hr class="my-3 border-gray-100" />
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'عنوان تبويب التقييمات', field: 'tabReviewsText' }"></ng-container>
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار محتوى التقييمات', field: 'showReviewsSection' }"></ng-container>
        <hr class="my-3 border-gray-100" />
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'عنوان تبويب المميزات', field: 'tabFeaturesText' }"></ng-container>
      </app-section-card>

      <app-section-card title="قائمة مميزات المنتج" [index]="4" [enabled]="config().showFeaturesSection" [isFirst]="false" [isLast]="true" (toggle)="updateConfig({showFeaturesSection: $event})" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()" [addAction]="{ label: 'إضافة ميزة', onClick: addFeature.bind(this) }">
        <div class="flex flex-col gap-3">
          <div *ngFor="let feat of config().features || []; let idx = index" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div class="flex flex-col gap-2 flex-1">
              <input type="text" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="feat.title" (ngModelChange)="updateFeature(idx, { title: $event })" placeholder="عنوان الميزة" />
              <input type="text" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-600" [ngModel]="feat.subtitle" (ngModelChange)="updateFeature(idx, { subtitle: $event })" placeholder="نص الميزة" />
              <select class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="feat.icon" (ngModelChange)="updateFeature(idx, { icon: $event })">
                <option value="shield">درع (shield)</option>
                <option value="feather">ريشة (feather)</option>
                <option value="posture">قوام (posture)</option>
                <option value="fabric">نسيج (fabric)</option>
                <option value="waist">خصر (waist)</option>
              </select>
            </div>
            <button (click)="removeFeature(idx)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md h-fit">
              <lucide-icon name="trash-2" [size]="16"></lucide-icon>
            </button>
          </div>
        </div>
      </app-section-card>

      <ng-template #textInputTemplate let-label="label" let-field="field">
        <div class="flex flex-col gap-1.5 mb-3">
          <span class="text-xs font-bold text-gray-700">{{ label | translate }}</span>
          <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500 font-medium" [ngModel]="$any(config())[field]" (ngModelChange)="updateConfigField(field, $event)" />
        </div>
      </ng-template>

      <ng-template #checkboxTemplate let-label="label" let-field="field">
        <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors mb-2">
          <span class="text-sm text-gray-700">{{ label | translate }}</span>
          <div class="relative inline-flex items-center">
            <input type="checkbox" class="sr-only peer" [checked]="!!$any(config())[field]" (change)="updateConfigCheckbox(field, $event)" />
            <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </div>
        </label>
      </ng-template>
    </div>
  `
})
export class ProductPageEditorComponent {
  readonly configService = inject(ProductPageConfigService);
  readonly config = this.configService.pageConfig;
  readonly Trash2 = Trash2;

  noop() {}

  updateConfig(updates: Partial<any>) {
    this.configService.updateConfig({ ...this.config(), ...updates });
  }

  updateConfigField(field: string, value: any) {
    this.updateConfig({ [field]: value });
  }

  updateConfigCheckbox(field: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.updateConfig({ [field]: checked });
  }

  addService() {
    const services = [...(this.config().services || [])];
    services.push({ id: 's-' + Date.now(), icon: 'Truck', text: 'شحن سريع ومجاني' });
    this.updateConfig({ services });
  }

  updateService(index: number, updates: any) {
    const services = [...(this.config().services || [])];
    services[index] = { ...services[index], ...updates };
    this.updateConfig({ services });
  }

  removeService(index: number) {
    const services = [...(this.config().services || [])];
    services.splice(index, 1);
    this.updateConfig({ services });
  }

  addFeature() {
    const features = [...(this.config().features || [])];
    features.push({ id: 'f-' + Date.now(), icon: 'shield', title: 'خامة فاخرة', subtitle: 'مريحة ومناسبة للاستخدام اليومي' });
    this.updateConfig({ features });
  }

  updateFeature(index: number, updates: any) {
    const features = [...(this.config().features || [])];
    features[index] = { ...features[index], ...updates };
    this.updateConfig({ features });
  }

  removeFeature(index: number) {
    const features = [...(this.config().features || [])];
    features.splice(index, 1);
    this.updateConfig({ features });
  }
}
