import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ChevronLeft, MessageCircle, Minus, Phone, Plus, Search } from 'lucide-angular';

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
  
  readonly ChevronLeft = ChevronLeft;
  readonly MessageCircle = MessageCircle;
  readonly Minus = Minus;
  readonly Phone = Phone;
  readonly Plus = Plus;
  readonly Search = Search;

  config = {
    subtitle: 'STOREFRONT.AUTO_STR_66',
    showSearch: true,
    searchPlaceholder: 'ابحث في الأسئلة...',
    showSupportCard: true,
    supportCardTitle: 'SEARCH.NOT_FOUND',
    supportCardSubtitle: 'STOREFRONT.AUTO_STR_140',
    faqs: [
      { id: 'size', question: 'STOREFRONT.AUTO_STR_243', answer: 'يمكنك معرفة مقاسك من خلال جدول المقاسات.' }
    ] as FaqItem[]
  };

  query = signal('');
  openId = signal<string | null>('size');

  filteredItems = computed(() => {
    const q = this.query().trim().toLocaleLowerCase();
    if (!q) return this.config.faqs;
    return this.config.faqs.filter(item => 
      `${item.question} ${item.answer}`.toLocaleLowerCase().includes(q)
    );
  });

  ngOnInit() {}

  toggleOpen(id: string) {
    this.openId.set(this.openId() === id ? null : id);
  }
}
