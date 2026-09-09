import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { BilingualInputComponent } from '../components/bilingual-input/bilingual-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { AboutPageConfigService } from '../../../../core/services/page-configs/about-page-config.service';
import { SectionCardComponent } from '../components/section-card/section-card.component';

@Component({
  selector: 'app-about-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule, SectionCardComponent, BilingualInputComponent],
  template: `
    <div class="w-full flex flex-col gap-2 pb-24" dir="rtl">
      <div class="text-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 mb-1">{{ 'ABOUT.TITLE' | translate }}</h2>
        <p class="text-sm text-gray-500">{{ 'DASHBOARD.AUTO_STR_49' | translate }}</p>
      </div>

      <app-section-card title="الرأس والمقدمة" [index]="0" [enabled]="config().showTitle" [isFirst]="true" [isLast]="false"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" (toggle)="updateConfig({ showTitle: $event })">
        <app-bilingual-input title="العنوان الرئيسي" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['headerTitleAr'] || ''" 
                [valueEn]="$any(config())['headerTitleEn'] || ''" 
                (valueChange)="updateBilingualField('headerTitle', $event.lang, $event.value)"></app-bilingual-input>
        <app-bilingual-input title="النص الفرعي" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['headerSubtitleAr'] || ''" 
                [valueEn]="$any(config())['headerSubtitleEn'] || ''" 
                (valueChange)="updateBilingualField('headerSubtitle', $event.lang, $event.value)"></app-bilingual-input>
        <hr class="my-3 border-gray-100" />
        <app-bilingual-input title="نص المقدمة" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['introTextAr'] || ''" 
                [valueEn]="$any(config())['introTextEn'] || ''" 
                (valueChange)="updateBilingualField('introText', $event.lang, $event.value)" [isTextArea]="true"></app-bilingual-input>
      </app-section-card>

      <app-section-card title="قسم لماذا نحن؟" [index]="1" [enabled]="config().showReasonsSection" [isFirst]="false" [isLast]="false"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" addActionLabel="إضافة سبب" (onAddAction)="addReason()"
        (toggle)="updateConfig({ showReasonsSection: $event })">
        <app-bilingual-input title="عنوان القسم" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['reasonsTitleAr'] || ''" 
                [valueEn]="$any(config())['reasonsTitleEn'] || ''" 
                (valueChange)="updateBilingualField('reasonsTitle', $event.lang, $event.value)"></app-bilingual-input>
        <div class="flex flex-col gap-3">
          <div *ngFor="let item of config().reasons; let idx = index; trackBy: trackByIndex" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div class="flex flex-col gap-2 flex-1">
              <div class="grid grid-cols-2 gap-2">
                <input type="text" dir="rtl" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" 
                  [ngModel]="item.titleAr" (ngModelChange)="updateReason(idx, { titleAr: $event })" placeholder="العنوان (عربي)" />
                <input type="text" dir="ltr" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" 
                  [ngModel]="item.titleEn" (ngModelChange)="updateReason(idx, { titleEn: $event })" placeholder="Title (EN)" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <textarea dir="rtl" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" 
                  [ngModel]="item.textAr" (ngModelChange)="updateReason(idx, { textAr: $event })" placeholder="الوصف (عربي)" rows="2"></textarea>
                <textarea dir="ltr" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" 
                  [ngModel]="item.textEn" (ngModelChange)="updateReason(idx, { textEn: $event })" placeholder="Description (EN)" rows="2"></textarea>
              </div>
              <select class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" 
                [ngModel]="item.icon" (ngModelChange)="updateReason(idx, { icon: $event })">
                <option value="ShieldCheck">درع (ShieldCheck)</option>
                <option value="Heart">قلب (Heart)</option>
                <option value="Star">نجمة (Star)</option>
              </select>
            </div>
            <button (click)="removeReason(idx)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md h-fit"><lucide-icon name="trash-2" [size]="16"></lucide-icon></button>
          </div>
        </div>
      </app-section-card>

      <app-section-card title="قسم الرؤية والرسالة" [index]="2" [enabled]="config().showVisionSection" [isFirst]="false" [isLast]="false"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" (toggle)="updateConfig({ showVisionSection: $event })">
        <app-bilingual-input title="عنوان الرؤية" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['visionTitleAr'] || ''" 
                [valueEn]="$any(config())['visionTitleEn'] || ''" 
                (valueChange)="updateBilingualField('visionTitle', $event.lang, $event.value)"></app-bilingual-input>
        <app-bilingual-input title="نص الرؤية" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['visionTextAr'] || ''" 
                [valueEn]="$any(config())['visionTextEn'] || ''" 
                (valueChange)="updateBilingualField('visionText', $event.lang, $event.value)" [isTextArea]="true"></app-bilingual-input>
        <hr class="my-3 border-gray-100" />
        <app-bilingual-input title="عنوان الرسالة" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['missionTitleAr'] || ''" 
                [valueEn]="$any(config())['missionTitleEn'] || ''" 
                (valueChange)="updateBilingualField('missionTitle', $event.lang, $event.value)"></app-bilingual-input>
        <app-bilingual-input title="نص الرسالة" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['missionTextAr'] || ''" 
                [valueEn]="$any(config())['missionTextEn'] || ''" 
                (valueChange)="updateBilingualField('missionText', $event.lang, $event.value)" [isTextArea]="true"></app-bilingual-input>
      </app-section-card>

      <app-section-card title="القيم" [index]="3" [enabled]="config().showValuesSection" [isFirst]="false" [isLast]="false"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" addActionLabel="إضافة قيمة" (onAddAction)="addValue()"
        (toggle)="updateConfig({ showValuesSection: $event })">
        <app-bilingual-input title="عنوان القسم" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['valuesTitleAr'] || ''" 
                [valueEn]="$any(config())['valuesTitleEn'] || ''" 
                (valueChange)="updateBilingualField('valuesTitle', $event.lang, $event.value)"></app-bilingual-input>
        <div class="flex flex-col gap-3">
          <div *ngFor="let item of config().values; let idx = index; trackBy: trackByIndex" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div class="flex flex-col gap-2 flex-1">
              <div class="grid grid-cols-2 gap-2">
                <input type="text" dir="rtl" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" 
                  [ngModel]="item.labelAr" (ngModelChange)="updateValue(idx, { labelAr: $event })" placeholder="القيمة (عربي)" />
                <input type="text" dir="ltr" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" 
                  [ngModel]="item.labelEn" (ngModelChange)="updateValue(idx, { labelEn: $event })" placeholder="Label (EN)" />
              </div>
              <select class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" 
                [ngModel]="item.icon" (ngModelChange)="updateValue(idx, { icon: $event })">
                <option value="ShieldCheck">درع (ShieldCheck)</option>
                <option value="Heart">قلب (Heart)</option>
                <option value="Star">نجمة (Star)</option>
                <option value="Target">هدف (Target)</option>
                <option value="Check">علامة صح (Check)</option>
              </select>
            </div>
            <button (click)="removeValue(idx)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md h-fit"><lucide-icon name="trash-2" [size]="16"></lucide-icon></button>
          </div>
        </div>
      </app-section-card>

      <app-section-card title="تواصل معنا" [index]="4" [enabled]="config().showContactSection" [isFirst]="false" [isLast]="true"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" addActionLabel="إضافة وسيلة تواصل" (onAddAction)="addContact()"
        (toggle)="updateConfig({ showContactSection: $event })">
        <app-bilingual-input title="عنوان القسم" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['contactTitleAr'] || ''" 
                [valueEn]="$any(config())['contactTitleEn'] || ''" 
                (valueChange)="updateBilingualField('contactTitle', $event.lang, $event.value)"></app-bilingual-input>
        <div class="flex flex-col gap-3">
          <div *ngFor="let item of config().contacts; let idx = index; trackBy: trackByIndex" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div class="flex flex-col gap-2 flex-1">
              <div class="grid grid-cols-2 gap-2">
                <input type="text" dir="rtl" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" 
                  [ngModel]="item.labelAr" (ngModelChange)="updateContact(idx, { labelAr: $event })" placeholder="الاسم (عربي)" />
                <input type="text" dir="ltr" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" 
                  [ngModel]="item.labelEn" (ngModelChange)="updateContact(idx, { labelEn: $event })" placeholder="Name (EN)" />
              </div>
              <input type="text" dir="ltr" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" 
                [ngModel]="item.link" (ngModelChange)="updateContact(idx, { link: $event })" placeholder="الرابط" />
              <select class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" 
                [ngModel]="item.icon" (ngModelChange)="updateContact(idx, { icon: $event })">
                <option value="facebook">فيسبوك (facebook)</option>
                <option value="instagram">إنستغرام (instagram)</option>
                <option value="mail">بريد (mail)</option>
                <option value="phone">هاتف (phone)</option>
                <option value="whatsapp">واتساب (whatsapp)</option>
              </select>
            </div>
            <button (click)="removeContact(idx)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md h-fit"><lucide-icon name="trash-2" [size]="16"></lucide-icon></button>
          </div>
        </div>
      </app-section-card>

      
    </div>
  `
})
export class AboutPageEditorComponent {
  private configService = inject(AboutPageConfigService);
  config = this.configService.pageConfig;

  constructor() {
    this.backfillLocalizedStrings();
  }

  backfillLocalizedStrings() {
    const c: any = { ...this.config() };
    let changed = false;
    const fields = [
      'headerTitle', 'headerSubtitle', 'introText', 'reasonsTitle',
      'visionTitle', 'visionText', 'missionTitle', 'missionText',
      'valuesTitle', 'contactTitle'
    ];
    
    for (const f of fields) {
      if (c[f] && !c[f + 'Ar'] && !c[f + 'En']) {
        c[f + 'Ar'] = c[f];
        c[f + 'En'] = c[f];
        changed = true;
      }
    }
    
    if (c.reasons) {
        c.reasons = c.reasons.map((r: any) => {
            let rc = false;
            if (r.title && !r.titleAr && !r.titleEn) { r.titleAr = r.title; r.titleEn = r.title; rc = true; }
            if (r.text && !r.textAr && !r.textEn) { r.textAr = r.text; r.textEn = r.text; rc = true; }
            if (rc) changed = true;
            return r;
        });
    }
    
    if (c.values) {
        c.values = c.values.map((v: any) => {
            if (v.label && !v.labelAr && !v.labelEn) { v.labelAr = v.label; v.labelEn = v.label; changed = true; }
            return v;
        });
    }

    if (c.contacts) {
        c.contacts = c.contacts.map((contact: any) => {
            if (contact.label && !contact.labelAr && !contact.labelEn) { contact.labelAr = contact.label; contact.labelEn = contact.label; changed = true; }
            return contact;
        });
    }

    if (changed) {
      this.configService.updateConfig(c);
    }
  }

  updateConfig(updates: Partial<any>) {
    this.configService.updateConfig({ ...this.config(), ...updates });
  }

  updateBilingualField(field: string, lang: 'Ar' | 'En', value: string) {
    const current = { ...this.config() } as any;
    current[field + lang] = value;
    current[field] = current[field + 'En'] || current[field + 'Ar'];
    this.updateConfig(current);
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  addReason() {
    const list = [...(this.config().reasons || [])];
    list.push({ id: 'r-' + Date.now(), icon: 'Star', title: 'ميزة جديدة', text: 'وصف قصير' });
    this.updateConfig({ reasons: list });
  }

  updateReason(index: number, updates: any) {
    const list = [...(this.config().reasons || [])];
    const newVal = { ...list[index], ...updates };
    if (updates.titleAr !== undefined || updates.titleEn !== undefined) {
      newVal.title = newVal.titleEn || newVal.titleAr;
    }
    if (updates.textAr !== undefined || updates.textEn !== undefined) {
      newVal.text = newVal.textEn || newVal.textAr;
    }
    list[index] = newVal;
    this.updateConfig({ reasons: list });
  }

  removeReason(index: number) {
    const list = [...(this.config().reasons || [])];
    list.splice(index, 1);
    this.updateConfig({ reasons: list });
  }

  addValue() {
    const list = [...(this.config().values || [])];
    list.push({ id: 'v-' + Date.now(), icon: 'Star', label: 'قيمة جديدة' });
    this.updateConfig({ values: list });
  }

  updateValue(index: number, updates: any) {
    const list = [...(this.config().values || [])];
    const newVal = { ...list[index], ...updates };
    if (updates.labelAr !== undefined || updates.labelEn !== undefined) {
      newVal.label = newVal.labelEn || newVal.labelAr;
    }
    list[index] = newVal;
    this.updateConfig({ values: list });
  }

  removeValue(index: number) {
    const list = [...(this.config().values || [])];
    list.splice(index, 1);
    this.updateConfig({ values: list });
  }

  addContact() {
    const list = [...(this.config().contacts || [])];
    list.push({ id: 'c-' + Date.now(), icon: 'phone', label: 'طريقة تواصل', link: '#' });
    this.updateConfig({ contacts: list });
  }

  updateContact(index: number, updates: any) {
    const list = [...(this.config().contacts || [])];
    const newVal = { ...list[index], ...updates };
    if (updates.labelAr !== undefined || updates.labelEn !== undefined) {
      newVal.label = newVal.labelEn || newVal.labelAr;
    }
    list[index] = newVal;
    this.updateConfig({ contacts: list });
  }

  removeContact(index: number) {
    const list = [...(this.config().contacts || [])];
    list.splice(index, 1);
    this.updateConfig({ contacts: list });
  }
}
