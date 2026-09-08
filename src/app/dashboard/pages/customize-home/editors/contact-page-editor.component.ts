import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { SectionCardComponent } from '../components/section-card/section-card.component';
import { AddItemButtonComponent } from '../components/add-item-button/add-item-button.component';
import { Component, inject} from '@angular/core';
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
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule, SectionCardComponent, AddItemButtonComponent],
  
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
                    <label class="flex flex-col gap-1.5"><span class="text-sm font-medium">{{ 'COMMON.ADDRESS' | translate }}</span><input type="text" [ngModel]="config().pageTitle" (ngModelChange)="updateConfig('pageTitle', $event)" class="lk-input h-10 px-3 rounded-xl border border-border" /></label>
                    <label class="flex flex-col gap-1.5"><span class="text-sm font-medium">{{ 'PRODUCT.DESCRIPTION' | translate }}</span><input type="text" [ngModel]="config().pageSubtitle" (ngModelChange)="updateConfig('pageSubtitle', $event)" class="lk-input h-10 px-3 rounded-xl border border-border" /></label>
                </div>
            </div>

            <div class="bg-card border border-border rounded-2xl overflow-hidden mb-4">
                <div class="p-4 bg-muted/30 border-b border-border font-medium flex justify-between items-center">
                    <span>{{ 'DASHBOARD.AUTO_STR_322' | translate }}</span>
                    <app-add-item-button (onClick)="addMethod()" label="طريقة جديدة"></app-add-item-button>
                </div>
                <div class="p-4 space-y-4">
                    <div *ngFor="let m of config().contactMethods" class="p-4 bg-muted/30 rounded-xl border border-border space-y-3 relative group">
                        <button type="button" (click)="deleteMethod(m.id)" class="absolute top-2 left-2 text-destructive opacity-0 group-hover:opacity-100">
                            <lucide-icon [img]="Trash2" size="16"></lucide-icon>
                        </button>
                        <label class="flex flex-col gap-1.5"><span class="text-xs font-medium">{{ 'COMMON.ADDRESS' | translate }}</span><input type="text" [ngModel]="m.title" (ngModelChange)="updateMethod(m.id, { title: $event })" class="lk-input h-8 px-2 rounded-lg border border-border text-sm" /></label>
                        <label class="flex flex-col gap-1.5"><span class="text-xs font-medium">{{ 'DASHBOARD.AUTO_STR_412' | translate }}</span><input type="text" [ngModel]="m.value" (ngModelChange)="updateMethod(m.id, { value: $event })" class="lk-input h-8 px-2 rounded-lg border border-border text-sm" /></label>
                    </div>
                </div>
            </div>

            <div class="bg-card border border-border rounded-2xl overflow-hidden mb-4">
                <div class="p-4 bg-muted/30 border-b border-border font-medium">{{ 'DASHBOARD.AUTO_STR_203' | translate }}</div>
                <div class="p-4 space-y-3">
                    <label class="flex items-center justify-between"><span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_233' | translate }}</span><input type="checkbox" [ngModel]="config().showContactForm" (ngModelChange)="updateConfig('showContactForm', $event)" class="lk-checkbox" /></label>
                    <label class="flex flex-col gap-1.5"><span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_234' | translate }}</span><input type="text" [ngModel]="config().formTitle" (ngModelChange)="updateConfig('formTitle', $event)" class="lk-input h-10 px-3 rounded-xl border border-border" /></label>
                    <label class="flex flex-col gap-1.5"><span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_323' | translate }}</span><input type="text" [ngModel]="config().formSubtitle" (ngModelChange)="updateConfig('formSubtitle', $event)" class="lk-input h-10 px-3 rounded-xl border border-border" /></label>
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

  updateConfig(key: string, value: any) {
    this.configService.updateConfig({ ...this.config(), [key]: value });
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

  updateMethod(id: string, updates: Partial<ContactMethod>) {
    this.updateConfig('contactMethods', (this.config().contactMethods || []).map((m: any) => m.id === id ? { ...m, ...updates } : m));
  }

  deleteMethod(id: string) {
    this.updateConfig('contactMethods', (this.config().contactMethods || []).filter((m: any) => m.id !== id));
  }
}
