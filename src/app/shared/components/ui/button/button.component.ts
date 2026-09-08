import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'xl';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-[#0E0E11] font-semibold hover:bg-brand-hover active:scale-[0.98] shadow-sm',
  secondary: 'bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 active:scale-[0.98]',
  outline: 'border border-border text-foreground font-medium hover:bg-muted active:scale-[0.98] bg-transparent',
  ghost: 'text-foreground font-medium hover:bg-muted active:scale-[0.98] bg-transparent',
  danger: 'bg-red-500 text-white font-semibold hover:bg-red-600 active:scale-[0.98]',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-xl',
  xl: 'h-14 px-8 text-base rounded-2xl',
};

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="classes()"
      [disabled]="disabled || loading"
    >
      <span *ngIf="loading" class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      <ng-content select="[leftIcon]" *ngIf="!loading"></ng-content>
      <ng-content></ng-content>
      <ng-content select="[rightIcon]" *ngIf="!loading"></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: Variant = 'primary';
  @Input() size: Size = 'md';
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() className = '';
  @Input() disabled = false;

  classes = computed(() => {
    const base = 'inline-flex items-center justify-center gap-2 transition-all duration-150 tap-highlight select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none';
    return `${base} ${VARIANTS[this.variant]} ${SIZES[this.size]} ${this.fullWidth ? 'w-full' : ''} ${this.className}`;
  });
}
