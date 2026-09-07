import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryPageConfigService, CategoryPageConfig } from '../../../../core/services/page-configs/category-page-config.service';

@Component({
  selector: 'app-category-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule],
  template: `
        <div class="w-full flex flex-col gap-2" dir="rtl">
            <div class="text-center mb-4">
                <h2 class="text-xl font-bold text-gray-900 mb-1">{{ 'DASHBOARD.AUTO_STR_66' | translate }}</h2>
                <p class="text-sm text-gray-500">{{ 'DASHBOARD.AUTO_STR_114' | translate }}</p>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div class="p-4 space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-bold text-gray-700">{{ 'DASHBOARD.AUTO_STR_67' | translate }}</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                class="sr-only peer"
                                [ngModel]="config().showTitle"
                                (ngModelChange)="updateConfig({ showTitle: $event })"
                            />
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
  `
})
export class CategoryPageEditorComponent {
  private configService = inject(CategoryPageConfigService);
  config = this.configService.pageConfig;

  updateConfig(updates: Partial<CategoryPageConfig>) {
    this.configService.updateConfig({ ...this.config(), ...updates });
  }
}
