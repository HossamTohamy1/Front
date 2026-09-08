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

  getStatusLabel(status: string, isAr: boolean = true) {
    const labels: Record<string, {ar: string, en: string}> = {
      'pending': {ar: 'قيد الانتظار', en: 'Pending'},
      'confirmed': {ar: 'مؤكد', en: 'Confirmed'},
      'shipped': {ar: 'تم الشحن', en: 'Shipped'},
      'delivered': {ar: 'تم التسليم', en: 'Delivered'},
      'cancelled': {ar: 'ملغي', en: 'Cancelled'},
      'all': {ar: 'الكل', en: 'All'}
    };
    const item = labels[status];
    if (!item) return status;
    return isAr ? item.ar : item.en;
  }
}
