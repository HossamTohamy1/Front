import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaqPageConfigService } from '../../../../core/services/page-configs/faq-page-config.service';
import { SectionCardComponent } from '../components/section-card/section-card.component';
import { LucideAngularModule, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-faq-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, SectionCardComponent, LucideAngularModule],
  template: `
    <div class="w-full flex flex-col gap-2 pb-24" dir="rtl">
        <div class="text-center mb-4">
            <h2 class="text-xl font-bold text-gray-900 mb-1">{{ 'FAQ.TITLE' | translate }}</h2>
            <p class="text-sm text-gray-500">{{ 'DASHBOARD.AUTO_STR_35' | translate }}</p>
        </div>

        <app-section-card title="رأس الصفحة والبحث" [index]="0" [enabled]="true" [isFirst]="true" [isLast]="false">
            <div class="flex flex-col gap-1.5 mb-2">
                <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_178' | translate }}</span>
                <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().title" (ngModelChange)="updateConfig({title: $event})" />
            </div>
            <div class="flex flex-col gap-1.5 mb-2">
                <span class="text-xs font-bold text-gray-700">{{ 'PRODUCT.DESCRIPTION' | translate }}</span>
                <textarea class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().subtitle" (ngModelChange)="updateConfig({subtitle: $event})" rows="2"></textarea>
            </div>
            <label class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors mb-2">
                <span class="text-sm text-gray-700">{{ 'DASHBOARD.AUTO_STR_183' | translate }}</span>
                <div class="relative inline-flex items-center">
                    <input type="checkbox" class="sr-only peer" [ngModel]="config().showSearch" (ngModelChange)="updateConfig({showSearch: $event})" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </div>
            </label>
            <div class="flex flex-col gap-1.5 mb-2">
                <span class="text-xs font-bold text-gray-700">نص مربع البحث (Placeholder)</span>
                <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().searchPlaceholder" (ngModelChange)="updateConfig({searchPlaceholder: $event})" />
            </div>
        </app-section-card>

        <app-section-card title="قائمة الأسئلة" [index]="1" [enabled]="true" [isFirst]="false" [isLast]="false" [addAction]="{ label: 'إضافة سؤال', onClick: addFaq }">
            <div class="flex flex-col gap-3">
                <div *ngFor="let faq of config().faqs; let idx = index; trackBy: trackById" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div class="flex flex-col gap-2 flex-1">
                        <input type="text" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="faq.question" (ngModelChange)="updateFaq(idx, { question: $event })" placeholder="السؤال" />
                        <textarea class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-600" [ngModel]="faq.answer" (ngModelChange)="updateFaq(idx, { answer: $event })" placeholder="الإجابة" rows="2"></textarea>
                    </div>
                    <button (click)="removeFaq(idx)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md h-fit">
                        <lucide-icon name="trash-2" [size]="16"></lucide-icon>
                    </button>
                </div>
            </div>
        </app-section-card>

        <app-section-card title="تذكرة الدعم (واتساب)" [index]="2" [enabled]="config().showSupportCard" [isFirst]="false" [isLast]="true" (toggle)="updateConfig({showSupportCard: $event})">
            <div class="flex flex-col gap-1.5 mb-2">
                <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_237' | translate }}</span>
                <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().supportCardTitle" (ngModelChange)="updateConfig({supportCardTitle: $event})" />
            </div>
            <div class="flex flex-col gap-1.5 mb-2">
                <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_325' | translate }}</span>
                <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="config().supportCardSubtitle" (ngModelChange)="updateConfig({supportCardSubtitle: $event})" />
            </div>
        </app-section-card>
    </div>
  `
})
export class FaqPageEditorComponent {
  faqService = inject(FaqPageConfigService);
  config = this.faqService.pageConfig;
  Trash2 = Trash2;

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
      faqs[index] = { ...faqs[index], ...updates };
      this.updateConfig({ faqs });
  }

  removeFaq(index: number) {
      const faqs = [...this.config().faqs];
      faqs.splice(index, 1);
      this.updateConfig({ faqs });
  }

  trackById(index: number, item: any): string {
    return item.id;
  }
}
