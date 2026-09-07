import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Search, ExternalLink } from 'lucide-angular';
import { AdminLayoutComponent } from '../../../shared/components/layout/admin-layout/admin-layout.component';
import { editLogs } from '../../../shared/data/mockData';
import { LangService } from '../../../core/services/lang/lang.service';

@Component({
  selector: 'app-edit-logs-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, RouterModule, LucideAngularModule, AdminLayoutComponent],
  templateUrl: './edit-logs-page.component.html',
  styleUrl: './edit-logs-page.component.css'
})
export class EditLogsPageComponent {
  private langService = inject(LangService);
  
  lang = this.langService.lang;

  readonly SearchIcon = Search;
  readonly ExternalLinkIcon = ExternalLink;

  search = signal('');
  filterUser = signal('');
  dateFrom = signal('');
  dateTo = signal('');

  editors = [...new Set(editLogs.map(l => l.editedBy))];

  filtered = computed(() => {
    let list = editLogs;
    const s = this.search().toLowerCase();
    if (s) {
      list = list.filter(l => l.orderNumber.toLowerCase().includes(s) || l.field.toLowerCase().includes(s));
    }
    const user = this.filterUser();
    if (user) {
      list = list.filter(l => l.editedBy === user);
    }
    const from = this.dateFrom();
    if (from) {
      list = list.filter(l => new Date(l.timestamp) >= new Date(from));
    }
    const to = this.dateTo();
    if (to) {
      list = list.filter(l => new Date(l.timestamp) <= new Date(to + 'T23:59:59'));
    }
    return list;
  });

  formatDate(d: string) {
    return new Date(d).toLocaleString(this.lang() === 'ar' ? 'ar-EG' : 'en-US');
  }
}
