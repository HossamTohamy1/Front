import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Search, ChevronRight, Filter } from 'lucide-angular';
import { AdminLayoutComponent } from '../../../shared/components/layout/admin-layout/admin-layout.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { orders as allOrders } from '../../../shared/data/mockData';
import { LangService } from '../../../core/services/lang/lang.service';

const STATUSES = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, RouterModule, LucideAngularModule, AdminLayoutComponent, BadgeComponent],
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent {
  private langService = inject(LangService);
  
  lang = this.langService.lang;
  dir = this.langService.dir;

  readonly SearchIcon = Search;
  readonly ChevronRightIcon = ChevronRight;
  readonly FilterIcon = Filter;

  statuses = STATUSES;
  search = signal('');
  filterStatus = signal('all');
  selected = signal<string[]>([]);

  filtered = computed(() => {
    let list = allOrders;
    const fStatus = this.filterStatus();
    const s = this.search().toLowerCase();
    
    if (fStatus !== 'all') {
      list = list.filter(o => o.status === fStatus);
    }
    
    if (s) {
      list = list.filter(o =>
        o.orderNumber.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        o.customerPhone.includes(s)
      );
    }
    return list;
  });

  isAllSelected = computed(() => {
    const f = this.filtered();
    return f.length > 0 && this.selected().length === f.length;
  });

  toggleSelect(id: string) {
    this.selected.update(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  toggleAll(checked: boolean) {
    if (checked) {
      this.selected.set(this.filtered().map(o => o.id));
    } else {
      this.selected.set([]);
    }
  }

  getVariant(status: string) {
    if (status === 'delivered') return 'success';
    if (status === 'cancelled') return 'danger';
    if (status === 'shipped') return 'primary';
    return 'warning';
  }

  getStatusLabel(status: string, isAr: boolean) {
    const labels: Record<string, {ar: string, en: string}> = {
      'pending': {ar: 'COMMON.PENDING', en: 'Pending'},
      'confirmed': {ar: 'COMMON.CONFIRMED', en: 'Confirmed'},
      'shipped': {ar: 'COMMON.SHIPPED', en: 'Shipped'},
      'delivered': {ar: 'DASHBOARD.AUTO_STR_341', en: 'Delivered'},
      'cancelled': {ar: 'COMMON.CANCELLED', en: 'Cancelled'},
      'all': {ar: 'COMMON.ALL', en: 'All'}
    };
    return labels[status] ? (isAr ? labels[status].ar : labels[status].en) : status;
  }
}
