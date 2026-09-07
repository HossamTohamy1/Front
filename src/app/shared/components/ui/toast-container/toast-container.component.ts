import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-angular';

export interface ToastType {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Component({
  selector: 'app-toast-item',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex items-start gap-3 bg-card border border-border shadow-xl rounded-2xl px-4 py-3 min-w-64 max-w-sm animate-slide-up">
      <div class="mt-0.5 shrink-0">
        <lucide-icon *ngIf="toast.type === 'success'" [img]="CheckCircleIcon" [size]="18" class="text-green-500"></lucide-icon>
        <lucide-icon *ngIf="toast.type === 'error'" [img]="AlertCircleIcon" [size]="18" class="text-red-500"></lucide-icon>
        <lucide-icon *ngIf="toast.type === 'info'" [img]="InfoIcon" [size]="18" class="text-brand"></lucide-icon>
        <lucide-icon *ngIf="toast.type === 'warning'" [img]="AlertTriangleIcon" [size]="18" class="text-amber-500"></lucide-icon>
      </div>
      <p class="flex-1 text-sm text-foreground">{{toast.message}}</p>
      <button
        (click)="dismiss()"
        class="shrink-0 text-muted-foreground hover:text-foreground transition-colors tap-highlight"
      >
        <lucide-icon [img]="XIcon" [size]="16"></lucide-icon>
      </button>
    </div>
  `
})
export class ToastItemComponent {
  @Input() toast!: ToastType;
  @Input() dismissCallback!: (id: string) => void;

  readonly CheckCircleIcon = CheckCircle;
  readonly AlertCircleIcon = AlertCircle;
  readonly InfoIcon = Info;
  readonly AlertTriangleIcon = AlertTriangle;
  readonly XIcon = X;

  dismiss() {
    this.dismissCallback(this.toast.id);
  }
}

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastItemComponent],
  template: `
    <div *ngIf="toasts.length > 0"
      class="fixed top-4 z-[100] flex flex-col gap-2"
      [ngClass]="dir === 'rtl' ? 'left-4' : 'right-4'"
    >
      <app-toast-item *ngFor="let t of toasts" [toast]="t" [dismissCallback]="dismissToast.bind(this)"></app-toast-item>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class ToastContainerComponent {
  @Input() toasts: ToastType[] = [];
  @Input() dir: 'ltr' | 'rtl' = 'rtl'; // Default to rtl based on the app

  dismissToast(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
