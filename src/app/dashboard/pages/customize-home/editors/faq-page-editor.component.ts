import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { BilingualInputComponent } from '../components/bilingual-input/bilingual-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaqPageConfigService } from '../../../../core/services/page-configs/faq-page-config.service';
import { SectionCardComponent } from '../components/section-card/section-card.component';
import { LucideAngularModule, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-faq-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, SectionCardComponent, LucideAngularModule, BilingualInputComponent],
  template: `
    <div class="w-full flex flex-col gap-2 pb-24" dir="rtl">
        <div class="text-center mb-4">
            <h2 class="text-xl font-bold text-gray-900 mb-1">{{ 'FAQ.TITLE' | translate }}</h2>
            <p class="text-sm text-gray-500">{{ 'DASHBOARD.AUTO_STR_35' | translate }}</p>
        </div>

        <app-section-card title="رأس الصفحة والبحث" [index]="0" [enabled]="true" [isFirst]="true" [isLast]="false">
            <app-bilingual-input title="DASHBOARD.AUTO_STR_178" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['titleAr'] || ''" 
                [valueEn]="$any(config())['titleEn'] || ''" 
                (valueChange)="updateBilingualField('title', $event.lang, $event.value)"></app-bilingual-input>
            <app-bilingual-input title="PRODUCT.DESCRIPTION" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['subtitleAr'] || ''" 
                [valueEn]="$any(config())['subtitleEn'] || ''" 
                (valueChange)="updateBilingualField('subtitle', $event.lang, $event.value)"></app-bilingual-input>
            <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors mb-2">
                <span class="text-sm text-gray-700">{{ 'DASHBOARD.AUTO_STR_183' | translate }}</span>
                <div class="relative inline-flex items-center">
                    <input type="checkbox" class="sr-only peer" [ngModel]="config().showSearch" (ngModelChange)="updateConfig({showSearch: $event})" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </div>
            </label>
            <app-bilingual-input title="نص مربع البحث (Placeholder)" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['searchPlaceholderAr'] || ''" 
                [valueEn]="$any(config())['searchPlaceholderEn'] || ''" 
                (valueChange)="updateBilingualField('searchPlaceholder', $event.lang, $event.value)"></app-bilingual-input>
        </app-section-card>

        <app-section-card title="قائمة الأسئلة" [index]="1" [enabled]="true" [isFirst]="false" [isLast]="false" [addAction]="{ label: 'إضافة سؤال', onClick: addFaq }">
            <div class="flex flex-col gap-3">
                <div *ngFor="let faq of config().faqs; let idx = index; trackBy: trackByIndex" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div class="flex flex-col gap-2 flex-1">
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" dir="rtl" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="faq.questionAr" (ngModelChange)="updateFaq(idx, { questionAr: $event })" placeholder="السؤال (عربي)" />
                            <input type="text" dir="ltr" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="faq.questionEn" (ngModelChange)="updateFaq(idx, { questionEn: $event })" placeholder="Question (EN)" />
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <textarea dir="rtl" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-600" [ngModel]="faq.answerAr" (ngModelChange)="updateFaq(idx, { answerAr: $event })" placeholder="الإجابة (عربي)" rows="2"></textarea>
                            <textarea dir="ltr" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-600" [ngModel]="faq.answerEn" (ngModelChange)="updateFaq(idx, { answerEn: $event })" placeholder="Answer (EN)" rows="2"></textarea>
                        </div>
                    </div>
                    <button (click)="removeFaq(idx)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md h-fit">
                        <lucide-icon name="trash-2" [size]="16"></lucide-icon>
                    </button>
                </div>
            </div>
        </app-section-card>

        <app-section-card title="تذكرة الدعم (واتساب)" [index]="2" [enabled]="config().showSupportCard" [isFirst]="false" [isLast]="true" (toggle)="updateConfig({showSupportCard: $event})">
            <app-bilingual-input title="DASHBOARD.AUTO_STR_237" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['supportCardTitleAr'] || ''" 
                [valueEn]="$any(config())['supportCardTitleEn'] || ''" 
                (valueChange)="updateBilingualField('supportCardTitle', $event.lang, $event.value)"></app-bilingual-input>
            <app-bilingual-input title="DASHBOARD.AUTO_STR_325" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['supportCardSubtitleAr'] || ''" 
                [valueEn]="$any(config())['supportCardSubtitleEn'] || ''" 
                (valueChange)="updateBilingualField('supportCardSubtitle', $event.lang, $event.value)"></app-bilingual-input>
        </app-section-card>
    </div>
  `
})
export class FaqPageEditorComponent {
  faqService = inject(FaqPageConfigService);
  config = this.faqService.pageConfig;
  Trash2 = Trash2;

  constructor() {
    this.backfillLocalizedStrings();
  }

  backfillLocalizedStrings() {
    const c: any = { ...this.config() };
    let changed = false;
    const fields = [
      'title', 'subtitle', 'searchPlaceholder', 'supportCardTitle', 'supportCardSubtitle'
    ];
    for (const f of fields) {
      if (c[f] && !c[f + 'Ar'] && !c[f + 'En']) {
        c[f + 'Ar'] = c[f];
        c[f + 'En'] = c[f];
        changed = true;
      }
    }

    if (c.faqs && c.faqs.length > 0) {
      const newFaqs = c.faqs.map((f: any) => {
        let fChanged = false;
        if (f.question && !f.questionAr && !f.questionEn) {
          f.questionAr = f.question;
          f.questionEn = f.question;
          fChanged = true;
        }
        if (f.answer && !f.answerAr && !f.answerEn) {
          f.answerAr = f.answer;
          f.answerEn = f.answer;
          fChanged = true;
        }
        if (fChanged) changed = true;
        return f;
      });
      c.faqs = newFaqs;
    }

    if (changed) {
      this.faqService.updateConfig(c);
    }
  }

  addFaq = () => {
      const faqs = [...this.config().faqs];
      faqs.push({ id: 'f-' + Date.now(), question: 'سؤال جديد', answer: 'إجابة جديدة' });
      this.updateConfig({ faqs });
  };

  updateConfig(updates: Partial<ReturnType<typeof this.config>>) {
      this.faqService.updateConfig({ ...this.config(), ...updates } as any);
  }

  updateFaq(index: number, updates: any) {
      const faqs = [...this.config().faqs];
      const newVal = { ...faqs[index], ...updates };
      
      if (updates.questionAr !== undefined || updates.questionEn !== undefined) {
        newVal.question = newVal.questionEn || newVal.questionAr;
      }
      if (updates.answerAr !== undefined || updates.answerEn !== undefined) {
        newVal.answer = newVal.answerEn || newVal.answerAr;
      }
      
      faqs[index] = newVal;
      this.updateConfig({ faqs });
  }

  removeFaq(index: number) {
      const faqs = [...this.config().faqs];
      faqs.splice(index, 1);
      this.updateConfig({ faqs });
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  updateBilingualField(field: string, lang: 'Ar' | 'En', value: string) {
    const current = { ...this.config() } as any;
    current[field + lang] = value;
    current[field] = current[field + 'En'] || current[field + 'Ar'];
    this.updateConfig(current);
  }
}
