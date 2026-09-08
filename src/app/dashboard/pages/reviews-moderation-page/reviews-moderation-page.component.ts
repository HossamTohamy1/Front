import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Eye, EyeOff, MessageCircle, Star } from 'lucide-angular';
import { AdminLayoutComponent } from '../../../shared/components/layout/admin-layout/admin-layout.component';
import { LangService } from '../../../core/services/lang/lang.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { reviews as initReviews, products } from '../../../shared/data/mockData';

@Component({
  selector: 'app-reviews-moderation-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, LucideAngularModule, AdminLayoutComponent],
  templateUrl: './reviews-moderation-page.component.html',
  styleUrl: './reviews-moderation-page.component.css'
})
export class ReviewsModerationPageComponent {
  private langService = inject(LangService);
  private toastService = inject(ToastService);

  lang = this.langService.lang;
  reviews = signal(initReviews);
  products = products;
  
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly MessageCircle = MessageCircle;
  readonly Star = Star;

  getProduct(productId: string) {
    return this.products.find((p: any) => p.id === productId);
  }

  toggleApprove(id: string) {
    this.reviews.update((prev: any[]) => prev.map(r => r.id === id ? { ...r, approved: !r.approved } : r));
    this.toastService.showToast('تم تحديث التقييم');
  }

  getArray(length: number): number[] {
    return Array.from({ length }, (_, i) => i);
  }
}
