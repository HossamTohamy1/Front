import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { LucideAngularModule, Ruler } from 'lucide-angular';

export interface SizeChartRow {
  size: string;
  waistCm: number;
  hipsCm: number;
  waistIn: number;
  hipsIn: number;
}

@Component({
  selector: 'app-size-guide-modal',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, ModalComponent, LucideAngularModule],
  template: `
    <app-modal [open]="open" (onClose)="onClose.emit()" [title]="lang === 'ar' ? 'PRODUCT.SIZE_GUIDE' : 'Size Guide'" size="lg">
      <p class="text-sm text-muted-foreground mb-4">
        {{ lang === 'ar' ? 'اعثري على مقاسك المثالي باستخدام دليلنا.' : 'Find your perfect fit with our guide.' }}
      </p>
      <div class="overflow-x-auto rounded-xl border border-border">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-muted">
              <th class="px-3 py-2.5 text-start font-semibold">Size</th>
              <th class="px-3 py-2.5 text-start font-semibold">{{ lang === 'ar' ? 'الخصر (سم)' : 'Waist (cm)' }}</th>
              <th class="px-3 py-2.5 text-start font-semibold">{{ lang === 'ar' ? 'الأرداف (سم)' : 'Hips (cm)' }}</th>
              <th class="px-3 py-2.5 text-start font-semibold">Waist (in)</th>
              <th class="px-3 py-2.5 text-start font-semibold">Hips (in)</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of sizeChart; let i = index" [ngClass]="i % 2 === 0 ? 'bg-card' : 'bg-muted/40'">
              <td class="px-3 py-2.5 font-semibold text-brand">{{row.size}}</td>
              <td class="px-3 py-2.5">{{row.waistCm}}</td>
              <td class="px-3 py-2.5">{{row.hipsCm}}</td>
              <td class="px-3 py-2.5">{{row.waistIn}}</td>
              <td class="px-3 py-2.5">{{row.hipsIn}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4 p-3 bg-secondary rounded-xl">
        <p class="text-xs text-secondary-foreground flex items-center gap-2">
          <lucide-icon [img]="RulerIcon" [size]="14"></lucide-icon>
          {{ lang === 'ar'
             ? 'قيسي خصرك في أضيق نقطة وأردافك في أوسع نقطة. إذا كنت بين مقاسين، اختاري الأكبر.'
             : 'Measure your waist at the narrowest point and hips at the widest. If between sizes, size up.' }}
        </p>
      </div>
    </app-modal>
  `,
  styles: [`:host { display: block; }`]
})
export class SizeGuideModalComponent {
  @Input() open = false;
  @Input() sizeChart: SizeChartRow[] = [];
  @Input() lang: 'ar' | 'en' = 'ar';
  @Output() onClose = new EventEmitter<void>();

  readonly RulerIcon = Ruler;
}

@Component({
  selector: 'app-size-guide',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, SizeGuideModalComponent],
  template: `
    <button
      (click)="onClick()"
      class="inline-flex items-center gap-1.5 text-sm text-brand font-medium hover:underline tap-highlight"
    >
      <lucide-icon [img]="RulerIcon" [size]="14"></lucide-icon>
      {{ lang === 'ar' ? 'PRODUCT.SIZE_GUIDE' : 'Size Guide' }}
    </button>
    <app-size-guide-modal [open]="isModalOpen" [sizeChart]="sizeChart" [lang]="lang" (onClose)="closeModal()"></app-size-guide-modal>
  `,
  styles: [`:host { display: inline-block; }`]
})
export class SizeGuideComponent {
  @Input() lang: 'ar' | 'en' = 'ar';
  @Input() sizeChart: SizeChartRow[] = [];
  @Output() actionClick = new EventEmitter<void>(); // renamed from onClick to actionClick to avoid conflict

  isModalOpen = false;
  readonly RulerIcon = Ruler;

  onClick() {
    this.isModalOpen = true;
    this.actionClick.emit();
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
