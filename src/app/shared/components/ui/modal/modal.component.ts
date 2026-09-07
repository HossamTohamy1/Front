import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="close()"></div>
      <div [class]="'relative bg-card text-card-foreground w-full ' + SIZES[size] + ' rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-up sm:animate-fade-in max-h-[90vh] overflow-y-auto ' + className">
        <div *ngIf="title" class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border sticky top-0 bg-card z-10">
          <h3 class="font-display font-semibold text-lg">{{title}}</h3>
          <button (click)="close()" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors tap-highlight">
            <lucide-icon name="x" [img]="XIcon" [size]="18"></lucide-icon>
          </button>
        </div>
        <div class="p-5">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent implements OnDestroy {
  @Input() set open(val: boolean) {
    this._open = val;
    if (val) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }
  get open() { return this._open; }
  private _open = false;

  @Input() title?: string;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() className = '';

  @Output() onClose = new EventEmitter<void>();

  readonly SIZES = SIZES;
  readonly XIcon = X;

  close() {
    this.onClose.emit();
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }
}
