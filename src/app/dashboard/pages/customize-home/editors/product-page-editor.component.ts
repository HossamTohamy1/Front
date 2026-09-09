import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { BilingualInputComponent } from '../components/bilingual-input/bilingual-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductPageConfigService } from '../../../../core/services/page-configs/product-page-config.service';
import { Trash2 } from 'lucide-angular';
import { SectionCardComponent } from '../components/section-card/section-card.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-product-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule, SectionCardComponent, BilingualInputComponent],
  template: `
    <div class="w-full flex flex-col gap-2 pb-24" dir="rtl">
      <div class="text-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 mb-1">{{ 'DASHBOARD.AUTO_STR_247' | translate }}</h2>
        <p class="text-sm text-gray-500">{{ 'DASHBOARD.AUTO_STR_12' | translate }}</p>
      </div>

      <app-section-card title="الرأس ومعلومات المنتج" [index]="0" [enabled]="true" [isFirst]="true" [isLast]="false" (toggle)="noop()" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار مسار التنقل (Breadcrumb)', field: 'showBreadcrumb' }"></ng-container>
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار علامة الأكثر مبيعاً', field: 'showBestSellerBadge' }"></ng-container>
        <app-bilingual-input title="نص علامة الأكثر مبيعاً" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['bestSellerTextAr'] || ''" 
                [valueEn]="$any(config())['bestSellerTextEn'] || ''" 
                (valueChange)="updateBilingualField('bestSellerText', $event.lang, $event.value)"></app-bilingual-input>
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار سطر التقييم', field: 'showRatingLine' }"></ng-container>
      </app-section-card>

      <app-section-card title="خيارات الشراء" [index]="1" [enabled]="true" [isFirst]="false" [isLast]="false" (toggle)="noop()" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار خيارات الألوان', field: 'showColorOptions' }"></ng-container>
        <app-bilingual-input title="تسمية اللون" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['colorLabelAr'] || ''" 
                [valueEn]="$any(config())['colorLabelEn'] || ''" 
                (valueChange)="updateBilingualField('colorLabel', $event.lang, $event.value)"></app-bilingual-input>
        <hr class="my-3 border-gray-100" />
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار خيارات المقاسات', field: 'showSizeOptions' }"></ng-container>
        <app-bilingual-input title="تسمية المقاس" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['sizeLabelAr'] || ''" 
                [valueEn]="$any(config())['sizeLabelEn'] || ''" 
                (valueChange)="updateBilingualField('sizeLabel', $event.lang, $event.value)"></app-bilingual-input>
        <app-bilingual-input title="نص دليل المقاسات" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['sizeGuideTextAr'] || ''" 
                [valueEn]="$any(config())['sizeGuideTextEn'] || ''" 
                (valueChange)="updateBilingualField('sizeGuideText', $event.lang, $event.value)"></app-bilingual-input>
        <hr class="my-3 border-gray-100" />
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار أزرار الشراء', field: 'showPurchaseActions' }"></ng-container>
        <app-bilingual-input title="نص زر إضافة للسلة" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['addToCartTextAr'] || ''" 
                [valueEn]="$any(config())['addToCartTextEn'] || ''" 
                (valueChange)="updateBilingualField('addToCartText', $event.lang, $event.value)"></app-bilingual-input>
        <app-bilingual-input title="نص زر الشراء السريع" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['buyNowTextAr'] || ''" 
                [valueEn]="$any(config())['buyNowTextEn'] || ''" 
                (valueChange)="updateBilingualField('buyNowText', $event.lang, $event.value)"></app-bilingual-input>
      </app-section-card>

      <app-section-card title="مميزات الخدمة (أسفل الشراء)" [index]="2" [enabled]="config().showServiceRow" [isFirst]="false" [isLast]="false" (toggle)="updateConfig({showServiceRow: $event})" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()" [addAction]="{ label: 'إضافة ميزة', onClick: addService.bind(this) }">
        <div class="flex flex-col gap-3">
          <div *ngFor="let svc of config().services || []; let idx = index; trackBy: trackByIndex" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div class="flex flex-col gap-2 flex-1">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <span class="text-[10px] font-bold text-gray-500 mb-1 block">نص الخدمة (عربي)</span>
                  <input type="text" dir="rtl" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="svc.textAr" (ngModelChange)="updateService(idx, { textAr: $event })" />
                </div>
                <div>
                  <span class="text-[10px] font-bold text-gray-500 mb-1 block">Text (EN)</span>
                  <input type="text" dir="ltr" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="svc.textEn" (ngModelChange)="updateService(idx, { textEn: $event })" />
                </div>
              </div>
              <select class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1 mt-1" [ngModel]="svc.icon" (ngModelChange)="updateService(idx, { icon: $event })">
                <option value="Truck">سيارة شحن (Truck)</option>
                <option value="RotateCcw">استرجاع (RotateCcw)</option>
                <option value="ShieldCheck">درع حماية (ShieldCheck)</option>
                <option value="BadgeCheck">شارة (BadgeCheck)</option>
              </select>
            </div>
            <button (click)="removeService(idx)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md h-fit mt-5">
              <lucide-icon name="trash-2" [size]="16"></lucide-icon>
            </button>
          </div>
        </div>
      </app-section-card>

      <app-section-card title="محتوى التفاصيل (التبويبات)" [index]="3" [enabled]="config().showTabs" [isFirst]="false" [isLast]="false" (toggle)="updateConfig({showTabs: $event})" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
        <app-bilingual-input title="عنوان تبويب الوصف" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['tabDescriptionTextAr'] || ''" 
                [valueEn]="$any(config())['tabDescriptionTextEn'] || ''" 
                (valueChange)="updateBilingualField('tabDescriptionText', $event.lang, $event.value)"></app-bilingual-input>
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار محتوى الوصف', field: 'showDescriptionSection' }"></ng-container>
        <hr class="my-3 border-gray-100" />
        <app-bilingual-input title="عنوان تبويب التقييمات" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['tabReviewsTextAr'] || ''" 
                [valueEn]="$any(config())['tabReviewsTextEn'] || ''" 
                (valueChange)="updateBilingualField('tabReviewsText', $event.lang, $event.value)"></app-bilingual-input>
        <ng-container *ngTemplateOutlet="checkboxTemplate; context: { label: 'إظهار محتوى التقييمات', field: 'showReviewsSection' }"></ng-container>
        <hr class="my-3 border-gray-100" />
        <app-bilingual-input title="عنوان تبويب المميزات" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['tabFeaturesTextAr'] || ''" 
                [valueEn]="$any(config())['tabFeaturesTextEn'] || ''" 
                (valueChange)="updateBilingualField('tabFeaturesText', $event.lang, $event.value)"></app-bilingual-input>
      </app-section-card>

      <app-section-card title="قائمة مميزات المنتج" [index]="4" [enabled]="config().showFeaturesSection" [isFirst]="false" [isLast]="true" (toggle)="updateConfig({showFeaturesSection: $event})" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()" [addAction]="{ label: 'إضافة ميزة', onClick: addFeature.bind(this) }">
        <div class="flex flex-col gap-3">
          <div *ngFor="let feat of config().features || []; let idx = index; trackBy: trackByIndex" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div class="flex flex-col gap-2 flex-1">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <span class="text-[10px] font-bold text-gray-500 mb-1 block">العنوان (عربي)</span>
                  <input type="text" dir="rtl" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="feat.titleAr" (ngModelChange)="updateFeature(idx, { titleAr: $event })" />
                </div>
                <div>
                  <span class="text-[10px] font-bold text-gray-500 mb-1 block">Title (EN)</span>
                  <input type="text" dir="ltr" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="feat.titleEn" (ngModelChange)="updateFeature(idx, { titleEn: $event })" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <span class="text-[10px] font-bold text-gray-500 mb-1 block">الوصف (عربي)</span>
                  <input type="text" dir="rtl" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-600" [ngModel]="feat.subtitleAr" (ngModelChange)="updateFeature(idx, { subtitleAr: $event })" />
                </div>
                <div>
                  <span class="text-[10px] font-bold text-gray-500 mb-1 block">Subtitle (EN)</span>
                  <input type="text" dir="ltr" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-600" [ngModel]="feat.subtitleEn" (ngModelChange)="updateFeature(idx, { subtitleEn: $event })" />
                </div>
              </div>
              <select class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1 mt-1" [ngModel]="feat.icon" (ngModelChange)="updateFeature(idx, { icon: $event })">
                <option value="shield">درع (shield)</option>
                <option value="feather">ريشة (feather)</option>
                <option value="posture">قوام (posture)</option>
                <option value="fabric">نسيج (fabric)</option>
                <option value="waist">خصر (waist)</option>
              </select>
            </div>
            <button (click)="removeFeature(idx)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md h-fit mt-5">
              <lucide-icon name="trash-2" [size]="16"></lucide-icon>
            </button>
          </div>
        </div>
      </app-section-card>

      

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

  constructor() {
    this.backfillLocalizedStrings();
  }

  backfillLocalizedStrings() {
    const c: any = { ...this.config() };
    let changed = false;
    const fields = [
      'bestSellerText', 'colorLabel', 'sizeLabel', 'sizeGuideText',
      'addToCartText', 'buyNowText', 'tabDescriptionText', 'tabReviewsText', 'tabFeaturesText'
    ];
    for (const f of fields) {
      if (c[f] && !c[f + 'Ar'] && !c[f + 'En']) {
        c[f + 'Ar'] = c[f];
        c[f + 'En'] = c[f];
        changed = true;
      }
    }
    
    if (c.services && c.services.length > 0) {
      const newServices = c.services.map((s: any) => {
        let sChanged = false;
        if (s.text && !s.textAr && !s.textEn) {
          s.textAr = s.text;
          s.textEn = s.text;
          sChanged = true;
        }
        if (sChanged) changed = true;
        return s;
      });
      c.services = newServices;
    }

    if (c.features && c.features.length > 0) {
      const newFeatures = c.features.map((f: any) => {
        let fChanged = false;
        if (f.title && !f.titleAr && !f.titleEn) {
          f.titleAr = f.title;
          f.titleEn = f.title;
          fChanged = true;
        }
        if (f.subtitle && !f.subtitleAr && !f.subtitleEn) {
          f.subtitleAr = f.subtitle;
          f.subtitleEn = f.subtitle;
          fChanged = true;
        }
        if (fChanged) changed = true;
        return f;
      });
      c.features = newFeatures;
    }

    if (changed) {
      this.configService.updateConfig(c);
    }
  }

  noop() {}

  updateConfig(updates: Partial<any>) {
    this.configService.updateConfig({ ...this.config(), ...updates });
  }

  updateBilingualField(field: string, lang: 'Ar' | 'En', value: string) {
    const current = { ...this.config() } as any;
    current[field + lang] = value;
    current[field] = current[field + 'En'] || current[field + 'Ar'];
    this.updateConfig(current);
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

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
