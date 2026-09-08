import { TranslatePipe, TranslateDirective, TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ChevronLeft, ChevronRight, MessageCircle, Minus, Phone, Plus, Search } from 'lucide-angular';
import { FaqPageConfigService } from '../../../../core/services/page-configs/faq-page-config.service';
import { LangService } from '../../../../core/services/lang/lang.service';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent implements OnInit {
  @Input() className = '';
  
  private faqConfigService = inject(FaqPageConfigService);
  private translate = inject(TranslateService);
  readonly langService = inject(LangService);

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly MessageCircle = MessageCircle;
  readonly Minus = Minus;
  readonly Phone = Phone;
  readonly Plus = Plus;
  readonly Search = Search;

  config = this.faqConfigService.pageConfig;

  query = signal('');
  openId = signal<string | null>('size');

  filteredItems = computed(() => {
    const q = this.query().trim().toLocaleLowerCase();
    const items = this.config().faqs || [];
    if (!q) return items;
    return items.filter(item => {
      const qText = (this.translate.instant(item.question) || item.question).toLocaleLowerCase();
      const aText = (this.translate.instant(item.answer) || item.answer).toLocaleLowerCase();
      return qText.includes(q) || aText.includes(q);
    });
  });

  ngOnInit() {}

  toggleOpen(id: string) {
    this.openId.set(this.openId() === id ? null : id);
  }
}
