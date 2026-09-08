import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginPageConfigService } from '../../../../core/services/page-configs/login-page-config.service';
import { AddItemButtonComponent } from '../components/add-item-button/add-item-button.component';
import { LucideAngularModule, Edit2, Image as ImageIcon, Trash2 } from 'lucide-angular';

export interface LoginBenefit {
    id: string;
    title: string;
    line1: string;
    line2: string;
}

@Component({
  selector: 'app-login-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, AddItemButtonComponent, LucideAngularModule],
  template: `
    <div class="space-y-4">
        <div class="bg-card border border-border rounded-2xl overflow-hidden mb-4">
            <div class="p-4 bg-muted/30 border-b border-border font-medium">القسم الترحيبي (Hero)</div>
            <div class="p-4 space-y-3">
                <div class="flex flex-col gap-1.5 mb-3">
                    <span class="text-sm font-medium">صورة البانر (الخلفية)</span>
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
                    <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_241' | translate }}</span>
                    <input
                        type="text"
                        [ngModel]="config().heroTitlePrefix"
                        (ngModelChange)="updateConfig('heroTitlePrefix', $event)"
                        class="lk-input h-10 px-3 rounded-xl border border-border"
                    />
                </label>
                <label class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_207' | translate }}</span>
                    <input
                        type="text"
                        [ngModel]="config().heroTitleHighlight"
                        (ngModelChange)="updateConfig('heroTitleHighlight', $event)"
                        class="lk-input h-10 px-3 rounded-xl border border-border"
                    />
                </label>
                <label class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_286' | translate }}</span>
                    <input
                        type="text"
                        [ngModel]="config().heroSubtitle"
                        (ngModelChange)="updateConfig('heroSubtitle', $event)"
                        class="lk-input h-10 px-3 rounded-xl border border-border"
                    />
                </label>
            </div>
        </div>

        <div class="bg-card border border-border rounded-2xl overflow-hidden mb-4">
            <div class="p-4 bg-muted/30 border-b border-border font-medium">{{ 'DASHBOARD.AUTO_STR_287' | translate }}</div>
            <div class="p-4 space-y-3">
                <label class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_234' | translate }}</span>
                    <input
                        type="text"
                        [ngModel]="config().welcomeTitle"
                        (ngModelChange)="updateConfig('welcomeTitle', $event)"
                        class="lk-input h-10 px-3 rounded-xl border border-border"
                    />
                </label>
                <label class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_242' | translate }}</span>
                    <input
                        type="text"
                        [ngModel]="config().welcomeSubtitle"
                        (ngModelChange)="updateConfig('welcomeSubtitle', $event)"
                        class="lk-input h-10 px-3 rounded-xl border border-border"
                    />
                </label>
                <label class="flex items-center justify-between">
                    <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_25' | translate }}</span>
                    <input
                        type="checkbox"
                        [ngModel]="config().showSocialLogin"
                        (ngModelChange)="updateConfig('showSocialLogin', $event)"
                        class="lk-checkbox"
                    />
                </label>
            </div>
        </div>

        <div class="bg-card border border-border rounded-2xl overflow-hidden mb-4">
            <div class="p-4 bg-muted/30 border-b border-border font-medium flex justify-between items-center">
                <span>{{ 'DASHBOARD.AUTO_STR_165' | translate }}</span>
                <app-add-item-button (onClick)="addBenefit()" label="ميزة جديدة"></app-add-item-button>
            </div>
            <div class="p-4 space-y-4">
                <div *ngFor="let benefit of config().benefits || []; trackBy: trackById" class="p-4 bg-muted/30 rounded-xl border border-border space-y-3 relative group">
                    <button
                        type="button"
                        (click)="deleteBenefit(benefit.id)"
                        class="absolute top-2 left-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <lucide-icon name="trash-2" [size]="16"></lucide-icon>
                    </button>
                    <label class="flex flex-col gap-1.5">
                        <span class="text-xs font-medium">{{ 'COMMON.ADDRESS' | translate }}</span>
                        <input
                            type="text"
                            [ngModel]="benefit.title"
                            (ngModelChange)="updateBenefit(benefit.id, { title: $event })"
                            class="lk-input h-8 px-2 rounded-lg border border-border text-sm"
                        />
                    </label>
                    <label class="flex flex-col gap-1.5">
                        <span class="text-xs font-medium">{{ 'DASHBOARD.AUTO_STR_329' | translate }}</span>
                        <input
                            type="text"
                            [ngModel]="benefit.line1"
                            (ngModelChange)="updateBenefit(benefit.id, { line1: $event })"
                            class="lk-input h-8 px-2 rounded-lg border border-border text-sm"
                        />
                    </label>
                    <label class="flex flex-col gap-1.5">
                        <span class="text-xs font-medium">{{ 'DASHBOARD.AUTO_STR_288' | translate }}</span>
                        <input
                            type="text"
                            [ngModel]="benefit.line2"
                            (ngModelChange)="updateBenefit(benefit.id, { line2: $event })"
                            class="lk-input h-8 px-2 rounded-lg border border-border text-sm"
                        />
                    </label>
                </div>
            </div>
        </div>
    </div>
  `
})
export class LoginPageEditorComponent {
  loginService = inject(LoginPageConfigService);
  config = this.loginService.pageConfig;

  Edit2 = Edit2;
  ImageIcon = ImageIcon;
  Trash2 = Trash2;

  changeImage() {
    const url = window.prompt("أدخل رابط الصورة الجديدة:", this.config().heroImage || '');
    if (url !== null) {
      this.updateConfig('heroImage', url);
    }
  }

  updateConfig(key: string, value: any) {
      this.loginService.updateConfig({ ...this.config(), [key]: value });
  }

  addBenefit() {
      const newBenefit: LoginBenefit = {
          id: crypto.randomUUID(),
          title: 'ميزة جديدة',
          line1: 'وصف الميزة الرئيسية',
          line2: 'تفاصيل إضافية عن الميزة',
      };
      this.updateConfig('benefits', [...(this.config().benefits || []), newBenefit]);
  }

  updateBenefit(id: string, updates: Partial<LoginBenefit>) {
      this.updateConfig('benefits', (this.config().benefits || []).map((b: LoginBenefit) => b.id === id ? { ...b, ...updates } : b));
  }

  deleteBenefit(id: string) {
      this.updateConfig('benefits', (this.config().benefits || []).filter((b: LoginBenefit) => b.id !== id));
  }

  trackById(index: number, item: any): string {
    return item.id;
  }
}
