import { Component, Input, ViewChild, ElementRef, OnInit, OnChanges, OnDestroy, SimpleChanges, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PreviewScrollService, PreviewScrollTarget } from '../../../core/services/page-configs/preview-scroll.service';
import { Subscription } from 'rxjs';

const MOBILE_DEVICE = { viewportW: 390, viewportH: 740, frameW: 390, frameH: 740 };
const DESKTOP_DEVICE = { viewportW: 1280, viewportH: 720, frameW: 1280, frameH: 720 };

const PREVIEW_CSS = `
/* â”€â”€ preview-scroll-fix â”€â”€ injected by LivePreview â”€â”€ */
.lk-home-page { overflow: visible !important; }
::-webkit-scrollbar, html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar {
    display: none !important; width: 0 !important; height: 0 !important; background: transparent !important;
}
html, body { scrollbar-width: none !important; -ms-overflow-style: none !important; }
`;

@Component({
  selector: 'app-live-preview',
  standalone: true,
  imports: [CommonModule],
  host: {
    style: 'display: block; width: 100%;'
  },
  template: `
    <div class="flex justify-center w-full">
      <ng-container *ngIf="mode === 'mobile'">
        <div
          class="relative flex-shrink-0 rounded-[3rem] border-[12px] border-gray-900 bg-white shadow-2xl flex flex-col overflow-hidden no-scrollbar"
          [style.width.px]="device.frameW" [style.height.px]="device.frameH"
        >
          <div class="flex justify-between items-center px-6 py-2.5 bg-white text-xs font-medium z-30 flex-shrink-0">
            <span>9:41</span>
            <div class="flex gap-1.5 items-center">
              <div class="w-4 h-3 bg-gray-900 rounded-[2px]"></div>
              <div class="w-3 h-3 bg-gray-900 rounded-full"></div>
              <div class="w-5 h-2.5 bg-gray-900 rounded-sm"></div>
            </div>
          </div>
          <iframe
            #iframeRef
            [src]="safeIframeSrc"
            title="Mobile Preview"
            class="block w-full h-full border-0"
            (load)="handleIframeLoad()"
            style="display: block; width: 100%; height: 100%; pointer-events: auto;"
          ></iframe>
        </div>
      </ng-container>

      <ng-container *ngIf="mode === 'desktop'">
        <div
          class="relative w-full rounded-2xl border border-gray-200 bg-white shadow-2xl flex flex-col overflow-hidden"
          [style.max-width.px]="device.frameW" [style.height.px]="device.frameH"
        >
          <div class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border-b border-gray-200 flex-shrink-0">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-red-400"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div class="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div class="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 text-center border border-gray-200 truncate">
              localhost Â· {{ iframePath }}
            </div>
          </div>
          <iframe
            #iframeRef
            [src]="safeIframeSrc"
            title="Desktop Preview"
            class="block w-full h-full border-0"
            (load)="handleIframeLoad()"
            style="display: block; width: 100%; height: 100%; pointer-events: auto;"
          ></iframe>
        </div>
      </ng-container>
    </div>
  `
})
export class LivePreviewComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode: 'mobile' | 'desktop' = 'mobile';
  @ViewChild('iframeRef') iframeRef!: ElementRef<HTMLIFrameElement>;

  device = MOBILE_DEVICE;
  iframePath = '/';
  safeIframeSrc: SafeResourceUrl;
  private scrollSub?: Subscription;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private sanitizer: DomSanitizer,
    private scrollService: PreviewScrollService
  ) {
    this.safeIframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl('/?preview=true');
  }

  ngOnInit() {
    this.device = this.mode === 'mobile' ? MOBILE_DEVICE : DESKTOP_DEVICE;

    this.scrollSub = this.scrollService.scrollToPreview$.subscribe(target => {
      this.scrollTo(target);
    });
  }

  ngOnDestroy() {
    this.scrollSub?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mode']) {
      this.device = this.mode === 'mobile' ? MOBILE_DEVICE : DESKTOP_DEVICE;
      this.iframePath = '/';
    }
  }

  scrollTo(target: PreviewScrollTarget) {
    const iframe = this.iframeRef?.nativeElement;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument;
      if (doc) {
        let targetEl: HTMLElement | null = null;

        // 1. Try by exact section ID
        if (target.sectionId) {
          targetEl = doc.getElementById('section-' + target.sectionId)
            || doc.getElementById(target.sectionId)
            || doc.getElementById('sec-' + target.sectionId)
            || doc.querySelector(`[data-section-id="${target.sectionId}"]`);
        }

        // 2. Try by section type mapping
        if (!targetEl && target.sectionType) {
          const typeSelectors: Record<string, string[]> = {
            hero: ['app-hero', '.lk-hero', '#section-sec-hero', '[data-section-type="hero"]'],
            benefits: ['app-benefits', '.lk-benefits-strip', '#section-sec-benefits', '[data-section-type="benefits"]'],
            categories: ['app-categories', '.lk-category-row', '#section-sec-categories', '[data-section-type="categories"]'],
            bestsellers: ['app-products', '.lk-bestsellers', '#section-sec-bestsellers', '[data-section-type="bestsellers"]'],
            promo: ['app-offer', '.lk-offer-banner', '#section-sec-promo', '[data-section-type="promo"]'],
            testimonials: ['app-testimonials', '#section-testimonials', '[data-section-type="testimonials"]'],
            faq: ['app-faq', '#section-faq', '[data-section-type="faq"]'],
            summary: ['.lk-product-summary', '.lk-about-hero', '.lk-cart-summary'],
            options: ['.lk-product-info', '.lk-purchase-actions'],
            features: ['.lk-product-features-grid', '.lk-product-features', '.lk-about-reasons'],
            tabs: ['.lk-product-tabs'],
            reviews: ['app-product-reviews', '#lk-reviews', '.lk-product-reviews-section'],
            reasons: ['.lk-about-reasons', '#reasons-section'],
            vision: ['.lk-about-vision'],
            team: ['.lk-about-team']
          };
          const candidates = typeSelectors[target.sectionType] || [`app-${target.sectionType}`, `[data-section-type="${target.sectionType}"]`];
          for (const sel of candidates) {
            targetEl = doc.querySelector(sel);
            if (targetEl) break;
          }
        }

        // 3. Try custom selector
        if (!targetEl && target.selector) {
          targetEl = doc.querySelector(target.selector);
        }

        // 4. Try by index
        if (!targetEl && typeof target.index === 'number') {
          const allSecs = doc.querySelectorAll('.lk-home-section-wrapper, .lk-home-page > *');
          if (allSecs && allSecs[target.index]) {
            targetEl = allSecs[target.index] as HTMLElement;
          }
        }

        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          this.pulseHighlight(targetEl, doc);
        }
      }
    } catch (_) {}

    // Also send postMessage as safe fallback
    try {
      iframe.contentWindow?.postMessage({
        type: 'SCROLL_TO_SECTION',
        target
      }, '*');
    } catch (_) {}
  }

  private pulseHighlight(el: HTMLElement, doc: Document) {
    if (!doc.getElementById('preview-pulse-style')) {
      const style = doc.createElement('style');
      style.id = 'preview-pulse-style';
      style.textContent = `
        @keyframes lkPreviewPulse {
          0% { outline: 3px solid rgba(37, 99, 235, 0.9); box-shadow: 0 0 25px rgba(37, 99, 235, 0.4); }
          50% { outline: 3px solid rgba(37, 99, 235, 0.6); box-shadow: 0 0 15px rgba(37, 99, 235, 0.25); }
          100% { outline: 3px solid transparent; box-shadow: none; }
        }
        .lk-preview-highlight-pulse {
          animation: lkPreviewPulse 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
          border-radius: 12px !important;
        }
      `;
      doc.head.appendChild(style);
    }
    el.classList.remove('lk-preview-highlight-pulse');
    void el.offsetWidth; // trigger reflow
    el.classList.add('lk-preview-highlight-pulse');
  }

  handleIframeLoad() {
    const iframe = this.iframeRef?.nativeElement;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument;
      if (doc) {
        this.injectPreviewCSS(doc);

        // Enable clicking in preview to scroll editor
        doc.addEventListener('click', (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          const sectionEl = target.closest('[data-section-id], [data-section-type], app-hero, app-benefits, app-categories, app-products, app-offer, .lk-home-section-wrapper');
          if (sectionEl) {
            const secId = sectionEl.getAttribute('data-section-id') || sectionEl.id?.replace(/^section-/, '');
            const secType = sectionEl.getAttribute('data-section-type');
            if (secId || secType) {
              this.scrollService.scrollToEditor(secId || secType!);
            }
          }
        }, true);
      }

      const href = iframe.contentWindow?.location?.pathname ?? '/';
      this.iframePath = href;

      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          { type: 'STOREFRONT_ROUTE_CHANGE', pathname: href },
          '*'
        );
      }
    } catch (_) {
    }
  }

  private injectPreviewCSS(doc: Document) {
    if (doc.getElementById('preview-scroll-fix')) return;
    const style = doc.createElement('style');
    style.id = 'preview-scroll-fix';
    style.textContent = PREVIEW_CSS;
    doc.head.appendChild(style);
  }
}
