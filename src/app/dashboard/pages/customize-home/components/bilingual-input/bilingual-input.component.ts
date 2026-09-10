import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';

@Component({
  selector: 'app-bilingual-input',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, TranslateDirective],
  template: `
    <div class="flex flex-col gap-1.5 mb-3" dir="rtl">
        <span class="text-sm font-bold text-gray-900 mb-1 text-right">{{ title | translate }}</span>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" dir="rtl">
            <div class="order-1 text-right">
                <span class="text-xs font-bold text-gray-500 mb-1 block text-right">{{ labelAr }}</span>
                <ng-container *ngIf="!isTextArea; else textareaAr">
                    <input type="text" dir="rtl" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500 font-medium text-right" 
                        [(ngModel)]="valueAr" 
                        (ngModelChange)="onValueChange('Ar', $event)" />
                </ng-container>
                <ng-template #textareaAr>
                    <textarea dir="rtl" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500 font-medium text-right" 
                        [(ngModel)]="valueAr" 
                        (ngModelChange)="onValueChange('Ar', $event)" rows="3"></textarea>
                </ng-template>
            </div>
            <div class="order-2 text-left">
                <span class="text-xs font-bold text-gray-500 mb-1 block text-left">{{ labelEn }}</span>
                <ng-container *ngIf="!isTextArea; else textareaEn">
                    <input type="text" dir="ltr" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500 font-medium text-left" 
                        [(ngModel)]="valueEn" 
                        (ngModelChange)="onValueChange('En', $event)" />
                </ng-container>
                <ng-template #textareaEn>
                    <textarea dir="ltr" class="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500 font-medium text-left" 
                        [(ngModel)]="valueEn" 
                        (ngModelChange)="onValueChange('En', $event)" rows="3"></textarea>
                </ng-template>
            </div>
        </div>
    </div>
  `
})
export class BilingualInputComponent {
  @Input() title: string = '';
  @Input() labelAr: string = 'عربي / AR';
  @Input() labelEn: string = 'English / EN';
  @Input() valueAr: string = '';
  @Input() valueEn: string = '';
  @Input() isTextArea: boolean = false;
  
  @Output() valueArChange = new EventEmitter<string>();
  @Output() valueEnChange = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<{ lang: 'Ar' | 'En', value: string }>();

  onValueChange(lang: 'Ar' | 'En', value: string) {
    if (lang === 'Ar') {
      this.valueAr = value;
      this.valueArChange.emit(value);
    } else {
      this.valueEn = value;
      this.valueEnChange.emit(value);
    }
    this.valueChange.emit({ lang, value });
  }
}
