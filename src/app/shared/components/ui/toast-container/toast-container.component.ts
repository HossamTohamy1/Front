import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-angular';
import { ToastService, Toast } from '../../../../core/services/toast/toast.service';
import { LangService } from '../../../../core/services/lang/lang.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css'
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
  readonly langService = inject(LangService);

  readonly CheckCircle2Icon = CheckCircle2;
  readonly AlertCircleIcon = AlertCircle;
  readonly InfoIcon = Info;
  readonly AlertTriangleIcon = AlertTriangle;
  readonly XIcon = X;

  dismissingIds = new Set<string>();

  trackById(_index: number, item: Toast): string {
    return item.id;
  }

  handleDismiss(id: string) {
    this.dismissingIds.add(id);
    setTimeout(() => {
      this.toastService.dismiss(id);
      this.dismissingIds.delete(id);
    }, 240);
  }
}
