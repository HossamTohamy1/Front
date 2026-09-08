import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-add-item-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button 
      (click)="onClick.emit()"
      class="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 border border-blue-100 rounded-md text-xs font-bold hover:bg-blue-100 transition-colors"
    >
      <lucide-icon name="plus" [size]="14" [strokeWidth]="3"></lucide-icon>
      {{ label }}
    </button>
  `
})
export class AddItemButtonComponent {
  @Input() label: string = '';
  @Output() onClick = new EventEmitter<void>();
}
