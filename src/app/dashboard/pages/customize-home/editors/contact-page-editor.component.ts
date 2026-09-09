import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { SectionCardComponent } from '../components/section-card/section-card.component';
import { AddItemButtonComponent } from '../components/add-item-button/add-item-button.component';
import { Component, inject} from '@angular/core';
import { BilingualInputComponent } from '../components/bilingual-input/bilingual-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Edit2, Image as ImageIcon, Trash2 } from 'lucide-angular';
import { ContactPageConfigService } from '../../../../core/services/page-configs/contact-page-config.service';

export interface ContactMethod {
  id: string;
  type: string;
  title: string;
  value: string;
  link: string;
}

@Component({
  selector: 'app-contact-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule, SectionCardComponent, AddItemButtonComponent, BilingualInputComponent],
  
  template: `
        <div class="space-y-4">
            <div class="bg-card border border-border rounded-2xl overflow-hidden mb-4">
                <div class="p-4 bg-muted/30 border-b border-border font-medium">{{ 'DASHBOARD.AUTO_STR_353' | translate }}</div>
                <div class="p-4 space-y-3">
                    <div class="flex flex-col gap-1.5 mb-3">
                        <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_321' | translate }}</span>
                        <div class="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                            <div class="w-16 h-16 rounded-md overflow-hidden flex items-center justify-center bg-gray-200">
                                <ng-container *ngIf="config().bannerImage; else placeholder">
                                    <img [src]="config().bannerImage" alt="Banner" class="w-full h-full object-cover" />
                                </ng-container>
                                <ng-template #placeholder>
                                    <lucide-icon [img]="ImageIcon" class="text-gray-400"></lucide-icon>
                                </ng-template>
                            </div>
                            <button (click)="changeBannerImage()" class="flex items-center gap-2 px-3 py-1.5 border border-blue-200 text-blue-600 rounded-md text-xs hover:bg-blue-50 bg-white mr-auto">
                                <lucide-icon [img]="Edit2" size="14"></lucide-icon><span>{{ 'DASHBOARD.AUTO_STR_432' | translate }}</span>
                            </button>
                        </div>
                    </div>
                    <app-bilingual-input title="COMMON.ADDRESS" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['pageTitleAr'] || ''" 
                [valueEn]="$any(config())['pageTitleEn'] || ''" 
                (valueChange)="updateBilingualField('pageTitle', $event.lang, $event.value)"></app-bilingual-input>
                    <app-bilingual-input title="PRODUCT.DESCRIPTION" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['pageSubtitleAr'] || ''" 
                [valueEn]="$any(config())['pageSubtitleEn'] || ''" 
                (valueChange)="updateBilingualField('pageSubtitle', $event.lang, $event.value)"></app-bilingual-input>
                </div>
            </div>

            <div class="bg-card border border-border rounded-2xl overflow-hidden mb-4">
                <div class="p-4 bg-muted/30 border-b border-border font-medium flex justify-between items-center">
                    <span>{{ 'DASHBOARD.AUTO_STR_322' | translate }}</span>
                    <app-add-item-button (onClick)="addMethod()" label="طريقة جديدة"></app-add-item-button>
                </div>
                <div class="p-4 space-y-4">
                    <div *ngFor="let m of config().contactMethods; let idx = index; trackBy: trackByIndex" class="p-4 bg-muted/30 rounded-xl border border-border space-y-3 relative group">
                        <button type="button" (click)="deleteMethod(m.id)" class="absolute top-2 left-2 text-destructive opacity-0 group-hover:opacity-100">
                            <lucide-icon [img]="Trash2" size="16"></lucide-icon>
                        </button>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <span class="text-[10px] font-bold text-gray-500 mb-1 block">العنوان (عربي)</span>
                                <input type="text" dir="rtl" class="lk-input h-8 px-2 rounded-lg border border-border text-sm" 
                                       [ngModel]="m.titleAr" (ngModelChange)="updateMethod(m.id, { titleAr: $event })" />
                            </div>
                            <div>
                                <span class="text-[10px] font-bold text-gray-500 mb-1 block">Title (EN)</span>
                                <input type="text" dir="ltr" class="lk-input h-8 px-2 rounded-lg border border-border text-sm" 
                                       [ngModel]="m.titleEn" (ngModelChange)="updateMethod(m.id, { titleEn: $event })" />
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <span class="text-[10px] font-bold text-gray-500 mb-1 block">القيمة (عربي)</span>
                                <input type="text" dir="rtl" class="lk-input h-8 px-2 rounded-lg border border-border text-sm" 
                                       [ngModel]="m.valueAr" (ngModelChange)="updateMethod(m.id, { valueAr: $event })" />
                            </div>
                            <div>
                                <span class="text-[10px] font-bold text-gray-500 mb-1 block">Value (EN)</span>
                                <input type="text" dir="ltr" class="lk-input h-8 px-2 rounded-lg border border-border text-sm" 
                                       [ngModel]="m.valueEn" (ngModelChange)="updateMethod(m.id, { valueEn: $event })" />
                            </div>
                        </div>
                        <label class="flex flex-col gap-1.5"><span class="text-xs font-medium">الرابط (Link)</span><input type="text" dir="ltr" [ngModel]="m.link" (ngModelChange)="updateMethod(m.id, { link: $event })" class="lk-input h-8 px-2 rounded-lg border border-border text-sm" /></label>
                    </div>
                </div>
            </div>

            <div class="bg-card border border-border rounded-2xl overflow-hidden mb-4">
                <div class="p-4 bg-muted/30 border-b border-border font-medium">{{ 'DASHBOARD.AUTO_STR_203' | translate }}</div>
                <div class="p-4 space-y-3">
                    <label class="flex items-center justify-between"><span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_233' | translate }}</span><input type="checkbox" [ngModel]="config().showContactForm" (ngModelChange)="updateConfig('showContactForm', $event)" class="lk-checkbox" /></label>
                    <app-bilingual-input title="DASHBOARD.AUTO_STR_234" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['formTitleAr'] || ''" 
                [valueEn]="$any(config())['formTitleEn'] || ''" 
                (valueChange)="updateBilingualField('formTitle', $event.lang, $event.value)"></app-bilingual-input>
                    <app-bilingual-input title="DASHBOARD.AUTO_STR_323" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['formSubtitleAr'] || ''" 
                [valueEn]="$any(config())['formSubtitleEn'] || ''" 
                (valueChange)="updateBilingualField('formSubtitle', $event.lang, $event.value)"></app-bilingual-input>
                </div>
            </div>

            
        </div>
  `
})
export class ContactPageEditorComponent {
  private configService = inject(ContactPageConfigService);
  config = this.configService.pageConfig;
  Edit2 = Edit2;
  ImageIcon = ImageIcon;
  Trash2 = Trash2;

  constructor() {
    this.backfillLocalizedStrings();
  }

  backfillLocalizedStrings() {
    const c: any = { ...this.config() };
    let changed = false;
    const fields = [
      'pageTitle', 'pageSubtitle', 'formTitle', 'formSubtitle'
    ];
    for (const f of fields) {
      if (c[f] && !c[f + 'Ar'] && !c[f + 'En']) {
        c[f + 'Ar'] = c[f];
        c[f + 'En'] = c[f];
        changed = true;
      }
    }

    if (c.contactMethods && c.contactMethods.length > 0) {
      const newMethods = c.contactMethods.map((m: any) => {
        let mChanged = false;
        if (m.title && !m.titleAr && !m.titleEn) {
          m.titleAr = m.title;
          m.titleEn = m.title;
          mChanged = true;
        }
        if (m.value && !m.valueAr && !m.valueEn) {
          m.valueAr = m.value;
          m.valueEn = m.value;
          mChanged = true;
        }
        if (mChanged) changed = true;
        return m;
      });
      c.contactMethods = newMethods;
    }

    if (changed) {
      this.configService.updateConfig(c);
    }
  }

  updateConfig(key: string, value: any) {
    this.configService.updateConfig({ ...this.config(), [key]: value });
  }

  updateBilingualField(field: string, lang: 'Ar' | 'En', value: string) {
    const current = { ...this.config() } as any;
    current[field + lang] = value;
    current[field] = current[field + 'En'] || current[field + 'Ar'];
    this.configService.updateConfig(current);
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  changeBannerImage() {
    const url = window.prompt("أدخل رابط الصورة الجديدة:", this.config().bannerImage || '');
    if (url !== null) {
      this.updateConfig('bannerImage', url);
    }
  }

  addMethod() {
    const newMethod: ContactMethod = { id: crypto.randomUUID(), type: 'phone', title: 'رقم جديد', value: '', link: '' };
    this.updateConfig('contactMethods', [...(this.config().contactMethods || []), newMethod]);
  }

  updateMethod(id: string, updates: any) {
    const methods = [...(this.config().contactMethods || [])];
    const index = methods.findIndex((m: any) => m.id === id);
    if (index !== -1) {
      const old = methods[index];
      const newVal = { ...old, ...updates };

      if (updates.titleAr !== undefined || updates.titleEn !== undefined) {
        newVal.title = newVal.titleEn || newVal.titleAr;
      }
      if (updates.valueAr !== undefined || updates.valueEn !== undefined) {
        newVal.value = newVal.valueEn || newVal.valueAr;
      }

      methods[index] = newVal;
      this.updateConfig('contactMethods', methods);
    }
  }

  deleteMethod(id: string) {
    this.updateConfig('contactMethods', (this.config().contactMethods || []).filter((m: any) => m.id !== id));
  }
}
