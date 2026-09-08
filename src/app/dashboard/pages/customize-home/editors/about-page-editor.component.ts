import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { AboutPageConfigService } from '../../../../core/services/page-configs/about-page-config.service';
import { SectionCardComponent } from '../components/section-card/section-card.component';

@Component({
  selector: 'app-about-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule, SectionCardComponent],
  template: `
    <div class="w-full flex flex-col gap-2 pb-24" dir="rtl">
      <div class="text-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 mb-1">{{ 'ABOUT.TITLE' | translate }}</h2>
        <p class="text-sm text-gray-500">{{ 'DASHBOARD.AUTO_STR_49' | translate }}</p>
      </div>

      <app-section-card title="الرأس والمقدمة" [index]="0" [enabled]="config().showTitle" [isFirst]="true" [isLast]="false"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" (toggle)="updateConfig({ showTitle: $event })">
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'العنوان الرئيسي', field: 'headerTitle' }"></ng-container>
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'النص الفرعي', field: 'headerSubtitle' }"></ng-container>
        <hr class="my-3 border-gray-100" />
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'نص المقدمة', field: 'introText', isTextArea: true }"></ng-container>
      </app-section-card>

      <app-section-card title="قسم لماذا نحن؟" [index]="1" [enabled]="config().showReasonsSection" [isFirst]="false" [isLast]="false"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" addActionLabel="إضافة سبب" (onAddAction)="addReason()"
        (toggle)="updateConfig({ showReasonsSection: $event })">
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'عنوان القسم', field: 'reasonsTitle' }"></ng-container>
        <div class="flex flex-col gap-3">
          <div *ngFor="let item of config().reasons; let idx = index" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div class="flex flex-col gap-2 flex-1">
              <input type="text" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" 
                [ngModel]="item.title" (ngModelChange)="updateReason(idx, { title: $event })" placeholder="العنوان" />
              <textarea class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" 
                [ngModel]="item.text" (ngModelChange)="updateReason(idx, { text: $event })" placeholder="الوصف" rows="2"></textarea>
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
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'عنوان الرؤية', field: 'visionTitle' }"></ng-container>
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'نص الرؤية', field: 'visionText', isTextArea: true }"></ng-container>
        <hr class="my-3 border-gray-100" />
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'عنوان الرسالة', field: 'missionTitle' }"></ng-container>
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'نص الرسالة', field: 'missionText', isTextArea: true }"></ng-container>
      </app-section-card>

      <app-section-card title="القيم" [index]="3" [enabled]="config().showValuesSection" [isFirst]="false" [isLast]="false"
        [draggable]="false" [showReorder]="false" [showCopy]="false" [showDelete]="false" addActionLabel="إضافة قيمة" (onAddAction)="addValue()"
        (toggle)="updateConfig({ showValuesSection: $event })">
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'عنوان القسم', field: 'valuesTitle' }"></ng-container>
        <div class="flex flex-col gap-3">
          <div *ngFor="let item of config().values; let idx = index" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div class="flex flex-col gap-2 flex-1">
              <input type="text" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" 
                [ngModel]="item.label" (ngModelChange)="updateValue(idx, { label: $event })" placeholder="القيمة" />
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
        <ng-container *ngTemplateOutlet="textInputTemplate; context: { label: 'عنوان القسم', field: 'contactTitle' }"></ng-container>
        <div class="flex flex-col gap-3">
          <div *ngFor="let item of config().contacts; let idx = index" class="flex gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div class="flex flex-col gap-2 flex-1">
              <input type="text" class="w-full text-sm font-bold bg-white border border-gray-200 rounded-md px-2 py-1" 
                [ngModel]="item.label" (ngModelChange)="updateContact(idx, { label: $event })" placeholder="الاسم" />
              <input type="text" class="w-full text-sm bg-white border border-gray-200 rounded-md px-2 py-1" 
                [ngModel]="item.link" (ngModelChange)="updateContact(idx, { link: $event })" placeholder="الرابط" dir="ltr" />
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

      <ng-template #textInputTemplate let-label="label" let-field="field" let-isTextArea="isTextArea">
        <div class="flex flex-col gap-1.5 mb-3">
          <span class="text-xs font-bold text-gray-700">{{ label | translate }}</span>
          <textarea *ngIf="isTextArea" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" 
            [ngModel]="getConfigValue(field)" (ngModelChange)="updateConfigField(field, $event)" rows="4"></textarea>
          <input *ngIf="!isTextArea" type="text" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500" 
            [ngModel]="getConfigValue(field)" (ngModelChange)="updateConfigField(field, $event)" />
        </div>
      </ng-template>
    </div>
  `
})
export class AboutPageEditorComponent {
  private configService = inject(AboutPageConfigService);
  config = this.configService.pageConfig;

  updateConfig(updates: Partial<any>) {
    this.configService.updateConfig({ ...this.config(), ...updates });
  }

  getConfigValue(field: string): any {
    return (this.config() as any)[field];
  }

  updateConfigField(field: string, value: any) {
    this.updateConfig({ [field]: value });
  }

  addReason() {
    const list = [...(this.config().reasons || [])];
    list.push({ id: 'r-' + Date.now(), icon: 'Star', title: 'ميزة جديدة', text: 'وصف قصير' });
    this.updateConfig({ reasons: list });
  }

  updateReason(index: number, updates: any) {
    const list = [...(this.config().reasons || [])];
    list[index] = { ...list[index], ...updates };
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
    list[index] = { ...list[index], ...updates };
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
    list[index] = { ...list[index], ...updates };
    this.updateConfig({ contacts: list });
  }

  removeContact(index: number) {
    const list = [...(this.config().contacts || [])];
    list.splice(index, 1);
    this.updateConfig({ contacts: list });
  }
}
