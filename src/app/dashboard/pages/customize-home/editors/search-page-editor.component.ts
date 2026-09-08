import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPageConfigService } from '../../../../core/services/page-configs/search-page-config.service';
import { SectionCardComponent } from '../components/section-card/section-card.component';
import { LucideAngularModule, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-search-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule, SectionCardComponent],
  template: `
    <div class="w-full flex flex-col gap-2 pb-24" dir="rtl">
      <div class="text-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 mb-1">{{ 'DASHBOARD.AUTO_STR_364' | translate }}</h2>
        <p class="text-sm text-gray-500">{{ 'DASHBOARD.AUTO_STR_32' | translate }}</p>
      </div>

      <app-section-card title="إعدادات حقل البحث" [index]="0" [enabled]="true" [isFirst]="true" [isLast]="false" (toggle)="noop()" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'نص حقل البحث (Placeholder)', field: 'searchPlaceholder' }"></ng-container>
      </app-section-card>

      <app-section-card title="عمليات البحث الشائعة" [index]="1" [enabled]="true" [isFirst]="false" [isLast]="false" (toggle)="noop()" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()" [addAction]="{ label: 'إضافة كلمة', onClick: addSuggestion.bind(this) }">
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'عنوان القسم', field: 'quickSuggestionsTitle' }"></ng-container>
        <div class="flex flex-col gap-2 mt-2">
          <div *ngFor="let sugg of config().quickSuggestions || []; let idx = index" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2">
            <input type="text" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" [ngModel]="sugg" (ngModelChange)="updateSuggestion(idx, $event)" />
            <button (click)="removeSuggestion(idx)" class="p-2 text-red-400 hover:text-red-600">
              <lucide-icon name="trash-2" [size]="16"></lucide-icon>
            </button>
          </div>
        </div>
      </app-section-card>

      <app-section-card title="عمليات البحث الأخيرة" [index]="2" [enabled]="config().showRecentSearch" [isFirst]="false" [isLast]="false" (toggle)="updateConfig({showRecentSearch: $event})" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'عنوان القسم', field: 'recentSearchTitle' }"></ng-container>
      </app-section-card>

      <app-section-card title="حالة عدم وجود نتائج" [index]="3" [enabled]="true" [isFirst]="false" [isLast]="false" (toggle)="noop()" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'العنوان', field: 'noResultsTitle' }"></ng-container>
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'الوصف الفرعي', field: 'noResultsSubtitle' }"></ng-container>
      </app-section-card>

      <app-section-card title="بطاقة الدعم والمساعدة" [index]="4" [enabled]="config().showSupportCard" [isFirst]="false" [isLast]="true" (toggle)="updateConfig({showSupportCard: $event})" (duplicate)="noop()" (delete)="noop()" (moveUp)="noop()" (moveDown)="noop()" (onDragStart)="noop()" (onDragEnd)="noop()" (onDragOver)="noop()" (onDrop)="noop()">
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'عنوان البطاقة', field: 'supportCardTitle' }"></ng-container>
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'النص الفرعي', field: 'supportCardSubtitle' }"></ng-container>
      </app-section-card>

      <ng-template #textInputTemplate let-label="label" let-field="field">
        <div class="flex flex-col gap-1.5 mb-3">
          <span class="text-xs font-bold text-gray-700">{{ label | translate }}</span>
          <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" [ngModel]="$any(config())[field] || ''" (ngModelChange)="updateConfigField(field, $event)" />
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
export class SearchPageEditorComponent {
  readonly configService = inject(SearchPageConfigService);
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

  addSuggestion() {
    const suggs = [...(this.config().quickSuggestions || [])];
    suggs.push('مشد كولومبي');
    this.updateConfig({ quickSuggestions: suggs });
  }

  updateSuggestion(index: number, val: string) {
    const suggs = [...(this.config().quickSuggestions || [])];
    suggs[index] = val;
    this.updateConfig({ quickSuggestions: suggs });
  }

  removeSuggestion(index: number) {
    const suggs = [...(this.config().quickSuggestions || [])];
    suggs.splice(index, 1);
    this.updateConfig({ quickSuggestions: suggs });
  }
}
