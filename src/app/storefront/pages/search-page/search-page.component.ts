import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, OnInit, signal, computed, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LucideAngularModule, Check, ChevronLeft, Headphones, Heart, MessageCircle, Search, ShoppingCart, Trash2, X } from 'lucide-angular';
import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';

export interface SearchPageConfig {
    searchPlaceholder: string;
    quickSuggestionsTitle: string;
    quickSuggestions: string[];
    recentSearchTitle: string;
    showRecentSearch: boolean;
    noResultsTitle: string;
    noResultsSubtitle: string;
    showSupportCard: boolean;
    supportCardTitle: string;
    supportCardSubtitle: string;
}

const initialConfig: SearchPageConfig = {
    searchPlaceholder: 'ابحث عن...',
    quickSuggestionsTitle: 'عمليات بحث شائعة:',
    quickSuggestions: [
        'SEARCH.MENS_WAIST',
        'SEARCH.WOMENS_WAIST',
        'SEARCH.SLIMMING_WAIST',
        'SEARCH.POSTPARTUM_WAIST',
    ],
    recentSearchTitle: 'SEARCH.RECENT',
    showRecentSearch: true,
    noResultsTitle: 'SEARCH.NO_RESULTS',
    noResultsSubtitle: 'SEARCH.TRY_DIFFERENT',
    showSupportCard: true,
    supportCardTitle: 'SEARCH.NOT_FOUND',
    supportCardSubtitle: 'SEARCH.WHATSAPP_HELP',
}

export interface Product {
  id: string;
  nameAr: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string;
  sizes: string[];
}

const products: Product[] = [
  // Mock data as needed
];

type SearchMode = 'idle' | 'success' | 'suggestions';
type SearchFeedbackType = 'success' | 'error';

type SearchFeedback = {
  id: number;
  type: SearchFeedbackType;
  title: string;
  message: string;
}

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, RouterModule, LucideAngularModule, StoreLayoutComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent implements OnInit, OnDestroy {
  // Icons
  Check = Check;
  ChevronLeft = ChevronLeft;
  Headphones = Headphones;
  Heart = Heart;
  MessageCircle = MessageCircle;
  Search = Search;
  ShoppingCart = ShoppingCart;
  Trash2 = Trash2;
  X = X;

  pageConfig = signal<SearchPageConfig>(initialConfig);
  logoHeader = '/assets/home/logo-header.png';

  query = signal<string>('');
  submittedQuery = signal<string>('');
  mode = signal<SearchMode>('idle');
  visibleProducts = signal<Product[]>([]);
  feedback = signal<SearchFeedback | null>(null);

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;
  private feedbackTimer: number | null = null;
  private handledInitialQuery = false;

  history = signal<{query: string, searchedAt: number}[]>([]);

  cartCount = signal<number>(3);
  displayedCartCount = computed(() => this.cartCount() || 3);

  resultHeading = computed(() => {
    const m = this.mode();
    const count = this.visibleProducts().length;
    if (m === 'success') return { label: 'STOREFRONT.AUTO_STR_378', count: `${count} نتيجة` };
    if (m === 'suggestions') return { label: 'STOREFRONT.AUTO_STR_261', count: `${count}` };
    return { label: 'STOREFRONT.AUTO_STR_317', count: '' };
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Load config from localStorage if available
    const saved = localStorage.getItem('loxxking-search-page-config');
    if (saved) {
      try {
        this.pageConfig.set({ ...initialConfig, ...JSON.parse(saved) });
      } catch (e) {}
    }
  }

  ngOnInit() {
    // History init
    const hist = localStorage.getItem('lk_search_history');
    if (hist) {
      try { this.history.set(JSON.parse(hist)); } catch(e) {}
    }

    this.route.queryParams.subscribe(params => {
      const q = params['q'];
      if (!this.handledInitialQuery) {
        this.handledInitialQuery = true;
        if (q) {
          this.query.set(q);
          this.runSearch(q);
        } else {
          this.visibleProducts.set(this.findSimilarProductSuggestions(''));
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
    }
  }

  closeSearch() {
    if (window.history.length > 1) {
      this.router.navigate(['..']);
    } else {
      this.router.navigate(['/']);
    }
  }

  clearInput() {
    this.query.set('');
    if (this.inputRef) {
      this.inputRef.nativeElement.focus();
    }
  }

  submitSearch(event: Event) {
    event.preventDefault();
    this.runSearch(this.query());
  }

  searchAgain() {
    this.query.set('');
    this.submittedQuery.set('');
    this.mode.set('idle');
    this.visibleProducts.set(this.findSimilarProductSuggestions(''));
    this.router.navigate([], { queryParams: {} });
    setTimeout(() => {
      if (this.inputRef) this.inputRef.nativeElement.focus();
    });
  }

  runSearch(rawQuery: string, options?: { focusAfter?: boolean }) {
    const trimmedQuery = rawQuery.trim().replace(/\s+/g, ' ');
    if (!trimmedQuery) {
      if (this.inputRef) this.inputRef.nativeElement.focus();
      return;
    }

    const exactMatches = this.findExactProductMatches(trimmedQuery);
    this.submittedQuery.set(trimmedQuery);
    this.query.set(trimmedQuery);
    this.addSearch(trimmedQuery);
    
    this.router.navigate([], { queryParams: { q: trimmedQuery }, queryParamsHandling: 'merge' });

    if (exactMatches.length > 0) {
      this.mode.set('success');
      this.visibleProducts.set(exactMatches);
      this.showFeedback('success');
    } else {
      this.mode.set('suggestions');
      this.visibleProducts.set(this.findSimilarProductSuggestions(trimmedQuery));
      this.showFeedback('error');
    }

    if (options?.focusAfter && this.inputRef) {
      this.inputRef.nativeElement.focus();
    }
  }

  addSearch(q: string) {
    let hist = this.history().filter(h => h.query !== q);
    hist.unshift({ query: q, searchedAt: Date.now() });
    hist = hist.slice(0, 10);
    this.history.set(hist);
    localStorage.setItem('lk_search_history', JSON.stringify(hist));
  }

  removeSearch(q: string) {
    const hist = this.history().filter(h => h.query !== q);
    this.history.set(hist);
    localStorage.setItem('lk_search_history', JSON.stringify(hist));
  }

  clearHistory() {
    this.history.set([]);
    localStorage.removeItem('lk_search_history');
  }

  showFeedback(type: SearchFeedbackType) {
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);

    const nextFeedback: SearchFeedback =
      type === 'success'
        ? {
            id: Date.now(),
            type,
            title: 'STOREFRONT.AUTO_STR_110',
            message: 'STOREFRONT.AUTO_STR_94',
          }
        : {
            id: Date.now(),
            type,
            title: 'STOREFRONT.AUTO_STR_95',
            message: 'STOREFRONT.AUTO_STR_63',
          };

    this.feedback.set(nextFeedback);
    this.playSearchFeedbackSound(type);

    this.feedbackTimer = window.setTimeout(() => {
      this.feedback.set(null);
      this.feedbackTimer = null;
    }, 3400);
  }

  closeFeedback() {
    this.feedback.set(null);
  }

  playSearchFeedbackSound(type: SearchFeedbackType) {
    try {
      const AudioContextConstructor =
        window.AudioContext ||
        (window as any).webkitAudioContext;

      if (!AudioContextConstructor) return;

      const audioContext = new AudioContextConstructor();
      const masterGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.13, audioContext.currentTime + 0.015);
      masterGain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + (type === 'success' ? 0.48 : 0.42)
      );
      masterGain.connect(audioContext.destination);

      const notes = type === 'success' ? [659.25, 783.99] : [233.08, 174.61];

      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const noteGain = audioContext.createGain();
        const startAt = audioContext.currentTime + index * 0.11;
        const stopAt = startAt + 0.25;

        oscillator.type = type === 'success' ? 'sine' : 'triangle';
        oscillator.frequency.setValueAtTime(frequency, startAt);
        noteGain.gain.setValueAtTime(0.0001, startAt);
        noteGain.gain.exponentialRampToValueAtTime(type === 'success' ? 0.75 : 0.55, startAt + 0.018);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, stopAt);

        oscillator.connect(noteGain);
        noteGain.connect(masterGain);
        oscillator.start(startAt);
        oscillator.stop(stopAt);
      });

      window.setTimeout(() => {
        void audioContext.close();
      }, 800);
    } catch {
      // Audio feedback is optional
    }
  }

  // Mocks for Search Utils
  findExactProductMatches(q: string): Product[] {
    return products.filter(p => p.nameAr.includes(q));
  }

  findSimilarProductSuggestions(q: string): Product[] {
    return products.slice(0, 4);
  }

  // Mock app methods
  addToCart(product: Product, size: string) {
    console.log('Added to cart', product, size);
  }
  showToast(msg: string, type: string) {}
  
  favorites = signal<string[]>([]);
  
  isFavorite(id: string): boolean {
    return this.favorites().includes(id);
  }

  toggleFavoriteProduct(id: string) {
    if (this.isFavorite(id)) {
      this.favorites.set(this.favorites().filter(f => f !== id));
      this.showToast('STOREFRONT.AUTO_STR_127', 'info');
    } else {
      this.favorites.set([...this.favorites(), id]);
      this.showToast('STOREFRONT.AUTO_STR_100', 'info');
    }
  }

  getSearchProductDisplay(product: Product) {
    return {
      name: product.nameAr,
      image: product.images[0],
      price: Math.round(product.price),
      oldPrice: Math.round(product.originalPrice ?? product.price),
      rating: product.rating,
      reviews: product.reviewCount,
      discount: product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0,
    };
  }
  
  getProductColors(product: Product) {
    return product.category === 'postpartum' ? ['#f2cfb7', '#050505'] : ['#050505', '#f2cfb7'];
  }

  getFirstSize(product: Product) {
    return product.sizes?.[0] ?? 'M';
  }

  getLastSize(product: Product) {
    return product.sizes?.[product.sizes.length - 1] ?? this.getFirstSize(product);
  }

  addProductToCart(event: MouseEvent, product: Product) {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart(product, this.getFirstSize(product));
    this.showToast('STOREFRONT.AUTO_STR_114', 'success');
  }

  toggleFavorite(event: MouseEvent, product: Product) {
    event.preventDefault();
    event.stopPropagation();
    this.toggleFavoriteProduct(product.id);
  }

  encodeURIComponent(str: string) {
    return encodeURIComponent(str);
  }
}
