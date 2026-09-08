import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { SectionCardComponent } from '../components/section-card/section-card.component';
import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesPageConfigService, CategoriesPageConfig } from '../../../../core/services/page-configs/categories-page-config.service';

@Component({
  selector: 'app-categories-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, SectionCardComponent],
  
  template: `
    <div class="w-full flex flex-col gap-2 pb-24" dir="rtl">
        <div class="text-center mb-4">
            <h2 class="text-xl font-bold text-gray-900 mb-1">{{ 'DASHBOARD.AUTO_STR_201' | translate }}</h2>
            <p class="text-sm text-gray-500">{{ 'DASHBOARD.AUTO_STR_13' | translate }}</p>
        </div>

        <app-section-card 
            title='DASHBOARD.AUTO_STR_429' 
            [index]="0" 
            [enabled]="config().showTitle" 
            [isFirst]="true" 
            [isLast]="false" 
            (toggle)="updateConfig({showTitle: $event})"
            (duplicate)="noop()"
            (delete)="noop()"
            (moveUp)="noop()"
            (moveDown)="noop()"
            (onDragStart)="noop()"
            (onDragEnd)="noop()"
            (onDragOver)="noop()"
            (onDrop)="noop()">
            
            <div class="flex flex-col gap-1.5 mb-3">
                <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_178' | translate }}</span>
                <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" 
                       [ngModel]="config().headerTitle" 
                       (ngModelChange)="updateConfig({headerTitle: $event})" />
            </div>
            
            <div class="flex flex-col gap-1.5 mb-3">
                <span class="text-xs font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_316' | translate }}</span>
                <input type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" 
                       [ngModel]="config().headerSubtitle" 
                       (ngModelChange)="updateConfig({headerSubtitle: $event})" />
            </div>
        </app-section-card>

        <app-section-card 
            title='CATEGORIES.TITLE' 
            [index]="1" 
            [enabled]="true" 
            [isFirst]="false" 
            [isLast]="true"
            (toggle)="noop()"
            (duplicate)="noop()"
            (delete)="noop()"
            (moveUp)="noop()"
            (moveDown)="noop()"
            (onDragStart)="noop()"
            (onDragEnd)="noop()"
            (onDragOver)="noop()"
            (onDrop)="noop()">
            
            <div class="flex flex-col gap-3">
                <div *ngFor="let cat of config().categories; let idx = index" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div class="flex flex-col gap-2 flex-1">
                        <div class="text-xs font-bold text-gray-500">التصنيف: {{cat.id}}</div>
                        <div class="flex gap-2">
                            <input type="text" class="flex-1 text-sm bg-white border border-gray-200 rounded-md px-2 py-1" 
                                   [ngModel]="cat.title" (ngModelChange)="updateCategory(idx, { title: $event })" placeholder='DASHBOARD.AUTO_STR_231' />
                            <input type="text" class="flex-1 text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1 text-blue-600" 
                                   [ngModel]="cat.accent" (ngModelChange)="updateCategory(idx, { accent: $event })" placeholder='DASHBOARD.AUTO_STR_202' />
                        </div>
                        <textarea class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" 
                                  [ngModel]="cat.description" (ngModelChange)="updateCategory(idx, { description: $event })" placeholder='PRODUCT.DESCRIPTION' rows="2"></textarea>
                        <input type="text" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" 
                               [ngModel]="cat.path" (ngModelChange)="updateCategory(idx, { path: $event })" placeholder='DASHBOARD.AUTO_STR_413' dir="ltr" />
                    </div>
                </div>
            </div>
        </app-section-card>
    </div>
  `
})
export class CategoriesPageEditorComponent {
  private configService = inject(CategoriesPageConfigService);
  config = this.configService.pageConfig;

  updateConfig(updates: Partial<CategoriesPageConfig>) {
    this.configService.updateConfig({ ...this.config(), ...updates });
  }

  updateCategory(index: number, updates: any) {
    const cats = [...(this.config().categories || [])];
    cats[index] = { ...cats[index], ...updates };
    this.updateConfig({ categories: cats });
  }

  noop() {}
}
