import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { BilingualInputComponent } from '../components/bilingual-input/bilingual-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPageConfigService } from '../../../../core/services/page-configs/search-page-config.service';
import { SectionCardComponent } from '../components/section-card/section-card.component';
import { LucideAngularModule, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-search-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule, SectionCardComponent, BilingualInputComponent],
  template: `
    <div class="w-full flex flex-col gap-2 pb-24" dir="rtl">
      <div class="text-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 mb-1">{{ 'DASHBOARD.AUTO_STR_364' | translate }}</h2>
        <p class="text-sm text-gray-500">{{ 'DASHBOARD.AUTO_STR_32' | translate }}</p>
      </div>

      <app-section-card title="إعدادات حقل البحث" [index]="0" [enabled]="true" [isFirst]="true" [isLast]="false" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
        <app-bilingual-input title="نص حقل البحث (Placeholder)" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['searchPlaceholderAr'] || ''" 
                [valueEn]="$any(config())['searchPlaceholderEn'] || ''" 
                (valueChange)="updateBilingualField('searchPlaceholder', $event.lang, $event.value)"></app-bilingual-input>
      </app-section-card>

      <app-section-card title="عمليات البحث الشائعة" [index]="1" [enabled]="true" [isFirst]="false" [isLast]="false" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()" [addAction]="{ label: 'إضافة كلمة', onClick: addSuggestion.bind(this) }">
        <app-bilingual-input title="عنوان القسم" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['quickSuggestionsTitleAr'] || ''" 
                [valueEn]="$any(config())['quickSuggestionsTitleEn'] || ''" 
                (valueChange)="updateBilingualField('quickSuggestionsTitle', $event.lang, $event.value)"></app-bilingual-input>
        <div class="flex flex-col gap-2 mt-2">
          <div *ngFor="let sugg of config().quickSuggestions || []; let idx = index; trackBy: trackByIndex" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2 items-start">
            <div class="flex flex-col sm:flex-row gap-2 w-full">
               <div class="w-full">
                 <span class="text-xs font-bold text-gray-500 mb-1 block">عربي / AR</span>
                 <input type="text" dir="rtl" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="sugg.textAr" (ngModelChange)="updateSuggestion(idx, { textAr: $event })" />
               </div>
               <div class="w-full">
                 <span class="text-xs font-bold text-gray-500 mb-1 block text-left">English / EN</span>
                 <input type="text" dir="ltr" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="sugg.textEn" (ngModelChange)="updateSuggestion(idx, { textEn: $event })" />
               </div>
            </div>
            <button (click)="removeSuggestion(idx)" class="p-2 mt-5 text-red-400 hover:text-red-600">
              <lucide-icon name="trash-2" [size]="16"></lucide-icon>
            </button>
          </div>
        </div>
      </app-section-card>

      <app-section-card title="عمليات البحث الأخيرة" [index]="2" [enabled]="config().showRecentSearch" [isFirst]="false" [isLast]="false" (toggle)="updateConfig({showRecentSearch: $event})" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
        <app-bilingual-input title="عنوان القسم" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['recentSearchTitleAr'] || ''" 
                [valueEn]="$any(config())['recentSearchTitleEn'] || ''" 
                (valueChange)="updateBilingualField('recentSearchTitle', $event.lang, $event.value)"></app-bilingual-input>
      </app-section-card>

      <app-section-card title="حالة عدم وجود نتائج" [index]="3" [enabled]="true" [isFirst]="false" [isLast]="false" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
        <app-bilingual-input title="العنوان" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['noResultsTitleAr'] || ''" 
                [valueEn]="$any(config())['noResultsTitleEn'] || ''" 
                (valueChange)="updateBilingualField('noResultsTitle', $event.lang, $event.value)"></app-bilingual-input>
        <app-bilingual-input title="الوصف الفرعي" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['noResultsSubtitleAr'] || ''" 
                [valueEn]="$any(config())['noResultsSubtitleEn'] || ''" 
                (valueChange)="updateBilingualField('noResultsSubtitle', $event.lang, $event.value)"></app-bilingual-input>
      </app-section-card>

      <app-section-card title="المنتجات المقترحة" [index]="4" [enabled]="true" [isFirst]="false" [isLast]="false" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
        <app-bilingual-input title="عنوان المنتجات المقترحة" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['suggestedProductsTitleAr'] || ''" 
                [valueEn]="$any(config())['suggestedProductsTitleEn'] || ''" 
                (valueChange)="updateBilingualField('suggestedProductsTitle', $event.lang, $event.value)"></app-bilingual-input>
      </app-section-card>

      <app-section-card title="بطاقة الدعم والمساعدة" [index]="5" [enabled]="config().showSupportCard" [isFirst]="false" [isLast]="true" (toggle)="updateConfig({showSupportCard: $event})" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
        <app-bilingual-input title="عنوان البطاقة" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['supportCardTitleAr'] || ''" 
                [valueEn]="$any(config())['supportCardTitleEn'] || ''" 
                (valueChange)="updateBilingualField('supportCardTitle', $event.lang, $event.value)"></app-bilingual-input>
        <app-bilingual-input title="النص الفرعي" labelAr="عربي / AR" labelEn="English / EN" 
                [valueAr]="$any(config())['supportCardSubtitleAr'] || ''" 
                [valueEn]="$any(config())['supportCardSubtitleEn'] || ''" 
                (valueChange)="updateBilingualField('supportCardSubtitle', $event.lang, $event.value)"></app-bilingual-input>
      </app-section-card>

      
    </div>
  `
})
export class SearchPageEditorComponent {
  readonly configService = inject(SearchPageConfigService);
  readonly config = this.configService.pageConfig;
  readonly Trash2 = Trash2;

  constructor() {
    this.backfillLocalizedStrings();
  }

  backfillLocalizedStrings() {
    const c: any = { ...this.config() };
    let changed = false;
    const fields = [
      'searchPlaceholder', 'quickSuggestionsTitle', 'recentSearchTitle', 
      'noResultsTitle', 'noResultsSubtitle', 'supportCardTitle', 'supportCardSubtitle', 'suggestedProductsTitle'
    ];
    for (const f of fields) {
      if (c[f] && !c[f + 'Ar'] && !c[f + 'En']) {
        c[f + 'Ar'] = c[f];
        c[f + 'En'] = c[f];
        changed = true;
      }
    }
    
    if (c.quickSuggestions && c.quickSuggestions.length > 0) {
      const newSuggs = c.quickSuggestions.map((s: any) => {
        if (typeof s === 'string') {
          changed = true;
          return { text: s, textAr: s, textEn: s };
        }
        return s;
      });
      c.quickSuggestions = newSuggs;
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

  addSuggestion() {
    const suggs = [...(this.config().quickSuggestions || [])];
    suggs.push({ text: 'مشد كولومبي', textAr: 'مشد كولومبي', textEn: 'Colombian Corset' });
    this.updateConfig({ quickSuggestions: suggs });
  }

  updateSuggestion(index: number, updates: any) {
    const suggs = [...(this.config().quickSuggestions || [])];
    suggs[index] = { ...suggs[index], ...updates };
    suggs[index].text = suggs[index].textEn || suggs[index].textAr || '';
    this.updateConfig({ quickSuggestions: suggs });
  }

  removeSuggestion(index: number) {
    const suggs = [...(this.config().quickSuggestions || [])];
    suggs.splice(index, 1);
    this.updateConfig({ quickSuggestions: suggs });
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
