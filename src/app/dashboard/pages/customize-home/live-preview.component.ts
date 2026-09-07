import { Component, Input, ViewChild, ElementRef, OnInit, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
export class LivePreviewComponent implements OnInit, OnChanges {
  @Input() mode: 'mobile' | 'desktop' = 'mobile';
  @ViewChild('iframeRef') iframeRef!: ElementRef<HTMLIFrameElement>;

  device = MOBILE_DEVICE;
  iframePath = '/';
  safeIframeSrc: SafeResourceUrl;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private sanitizer: DomSanitizer
  ) {
    this.safeIframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl('/?preview=true');
  }

  ngOnInit() {
    this.device = this.mode === 'mobile' ? MOBILE_DEVICE : DESKTOP_DEVICE;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mode']) {
      this.device = this.mode === 'mobile' ? MOBILE_DEVICE : DESKTOP_DEVICE;
      this.iframePath = '/';
    }
  }

  handleIframeLoad() {
    const iframe = this.iframeRef?.nativeElement;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument;
      if (doc) {
        this.injectPreviewCSS(doc);
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
