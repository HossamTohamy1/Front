import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Download, Search } from 'lucide-angular';

import { AdminLayoutComponent } from '../../../shared/components/layout/admin-layout/admin-layout.component';
import { LangService } from '../../../core/services/lang/lang.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { orders } from '../../../shared/data/mockData';

@Component({
  selector: 'app-invoices-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule, AdminLayoutComponent],
  templateUrl: './invoices-page.component.html',
  styleUrls: ['./invoices-page.component.css']
})
export class InvoicesPageComponent {
  private langService = inject(LangService);
  private toastService = inject(ToastService);

  readonly SearchIcon = Search;
  readonly DownloadIcon = Download;

  lang = this.langService.lang;
  
  search = signal('');

  filtered = computed(() => {
    const s = this.search().toLowerCase();
    if (!s) return orders;
    return orders.filter(o =>
      o.orderNumber.toLowerCase().includes(s) ||
      o.customerName.toLowerCase().includes(s)
    );
  });

  downloadInvoice() {
    this.toastService.showToast(this.lang() === 'ar' ? 'جار التحميل...' : 'Downloading...', 'info');
  }

  getInvoiceNumber(orderNumber: string) {
    const parts = orderNumber.split('-');
    return `INV-${parts.length > 2 ? parts[2] : parts[parts.length - 1]}`;
  }
}
