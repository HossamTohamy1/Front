import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Edit2, Image as ImageIcon } from 'lucide-angular';
import { SizeGuidePageConfigService } from '../../../../core/services/page-configs/size-guide-page-config.service';

@Component({
  selector: 'app-size-guide-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-4">
      <div class="bg-card border border-border rounded-2xl overflow-hidden mb-4">
        <div class="p-4 bg-muted/30 border-b border-border font-medium">{{ 'DASHBOARD.AUTO_STR_353' | translate }}</div>
        <div class="p-4 space-y-3">
          <div class="flex flex-col gap-1.5 mb-3">
            <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_321' | translate }}</span>
            <div class="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
              <div class="w-16 h-16 rounded-md overflow-hidden flex items-center justify-center bg-gray-200">
                <img *ngIf="config().heroImage" [src]="config().heroImage" alt="Banner" class="w-full h-full object-cover" />
                <lucide-icon *ngIf="!config().heroImage" name="image" class="text-gray-400"></lucide-icon>
              </div>
              <button (click)="changeImage()" class="flex items-center gap-2 px-3 py-1.5 border border-blue-200 text-blue-600 rounded-md text-xs hover:bg-blue-50 bg-white mr-auto">
                <lucide-icon name="edit-2" [size]="14"></lucide-icon><span>{{ 'DASHBOARD.AUTO_STR_432' | translate }}</span>
              </button>
            </div>
          </div>
          <label class="flex flex-col gap-1.5">
            <span class="text-sm font-medium">{{ 'COMMON.ADDRESS' | translate }}</span>
            <input type="text" [ngModel]="config().pageTitle" (ngModelChange)="updateConfig('pageTitle', $event)" class="lk-input h-10 px-3 rounded-xl border border-border" />
          </label>
          <label class="flex flex-col gap-1.5">
            <span class="text-sm font-medium">{{ 'PRODUCT.DESCRIPTION' | translate }}</span>
            <input type="text" [ngModel]="config().pageSubtitle" (ngModelChange)="updateConfig('pageSubtitle', $event)" class="lk-input h-10 px-3 rounded-xl border border-border" />
          </label>
        </div>
      </div>
      <div class="bg-card border border-border rounded-2xl overflow-hidden mb-4">
        <div class="p-4 bg-muted/30 border-b border-border font-medium">{{ 'DASHBOARD.AUTO_STR_250' | translate }}</div>
        <div class="p-4 space-y-3">
          <label class="flex items-center justify-between">
            <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_107' | translate }}</span>
            <input type="checkbox" [checked]="config().showMeasurementsTable" (change)="updateCheckbox('showMeasurementsTable', $event)" class="lk-checkbox" />
          </label>
          <label class="flex items-center justify-between">
            <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_123' | translate }}</span>
            <input type="checkbox" [checked]="config().showHelpSection" (change)="updateCheckbox('showHelpSection', $event)" class="lk-checkbox" />
          </label>
        </div>
      </div>
    </div>
  `
})
export class SizeGuidePageEditorComponent {
  readonly configService = inject(SizeGuidePageConfigService);
  readonly config = this.configService.pageConfig;

  updateConfig(key: string, value: any) {
    this.configService.updateConfig({ ...this.config(), [key]: value });
  }

  updateCheckbox(key: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.updateConfig(key, checked);
  }

  changeImage() {
    const url = window.prompt("أدخل رابط الصورة الجديدة:", this.config().heroImage || '');
    if (url !== null) {
      this.updateConfig('heroImage', url);
    }
  }
}
