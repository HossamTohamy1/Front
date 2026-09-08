import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, GripVertical, Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-angular';

@Component({
  selector: 'app-section-card',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, LucideAngularModule],
  templateUrl: './section-card.component.html',
  styles: ``
})
export class SectionCardComponent {
  @Input() title: string = '';
  @Input() index: number = 0;
  @Input() enabled: boolean = true;
  @Input() isFirst: boolean = false;
  @Input() isLast: boolean = false; @Input() showReorder: boolean = true; @Input() showCopy: boolean = true; @Input() showDelete: boolean = true;
  @Input() addAction?: { label: string; onClick: () => void };

  @Output() toggle = new EventEmitter<boolean>();
  @Output() duplicate = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() moveUp = new EventEmitter<void>();
  @Output() moveDown = new EventEmitter<void>();
  
  readonly GripVertical = GripVertical;
  readonly Trash2 = Trash2;
  readonly Copy = Copy;
  readonly ArrowUp = ArrowUp;
  readonly ArrowDown = ArrowDown;

  onToggle(event: Event) {
    const target = event.target as HTMLInputElement;
    this.toggle.emit(target.checked);
  }
}
