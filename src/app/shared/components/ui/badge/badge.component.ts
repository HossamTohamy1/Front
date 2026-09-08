import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type Variant = 'primary' | 'success' | 'warning' | 'danger' | 'muted' | 'outline';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-secondary text-secondary-foreground',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  muted: 'bg-muted text-muted-foreground',
  outline: 'border border-border text-muted-foreground bg-transparent',
};

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex items-center font-medium rounded-full"
          [ngClass]="[sizeClass(), variantClass(), className]">
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  @Input() set variant(val: Variant) {
    this._variant.set(val);
  }
  @Input() set size(val: 'sm' | 'md') {
    this._size.set(val);
  }
  @Input() className: string = '';

  private _variant = signal<Variant>('primary');
  private _size = signal<'sm' | 'md'>('md');

  sizeClass = computed(() => this._size() === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2.5 py-1');
  variantClass = computed(() => VARIANTS[this._variant()]);
}
