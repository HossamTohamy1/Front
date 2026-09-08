import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Smartphone, Monitor, Eye, Undo2, Redo2, Lock } from 'lucide-angular';
import { LivePreviewComponent } from './live-preview.component';
import { EditorRouterComponent } from './editors/editor-router.component';
import { AdminLayoutComponent } from '../../../shared/components/layout/admin-layout/admin-layout.component';

@Component({
  selector: 'app-customize-home-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, 
    CommonModule, 
    LucideAngularModule, 
    LivePreviewComponent, 
    EditorRouterComponent,
    AdminLayoutComponent
  ],
  template: `
    <app-admin-layout>
      <div class="flex flex-col h-full bg-gray-50/50">
        <!-- Toolbar -->
        <div class="flex items-center justify-between p-4 flex-row-reverse bg-white border-b border-gray-200">
          <div class="flex flex-col items-center gap-4">
            <h1 class="text-xl font-black text-gray-900 tracking-tight">{{ 'DASHBOARD.AUTO_STR_270' | translate }}</h1>
            <span class="text-sm text-gray-500 hidden md:inline">
              Ù‚Ù… Ø¨ØªØ®ØµÙŠØµ ÙˆØªØ¹Ø¯ÙŠÙ„ ÙˆØ§Ø¬Ù‡Ø§Øª Ø§Ù„Ù…ØªØ¬Ø± Ø§Ù„Ù…Ø®ØªÙ„ÙØ©. Ø³ØªØ¸Ù‡Ø± Ø§Ù„ØªØºÙŠÙŠØ±Ø§Øª Ø¨Ø´ÙƒÙ„ Ù…Ø¨Ø§Ø´Ø±.
            </span>
          </div>

          <div class="flex flex-row-reverse items-center gap-4">
            <!-- Quick Navigation Dropdown (placeholder) -->
            <div class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">
                <span class="text-gray-500 font-medium">Ø§Ù„ØµÙØ­Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ©:</span>
                <span class="font-bold font-mono text-xs">{{ currentRoute }}</span>
            </div>

            <div class="flex bg-gray-100 rounded-lg p-1">
              <button
                class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                [ngClass]="previewMode === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'"
                (click)="previewMode = 'desktop'"
              >
                <lucide-icon name="monitor" [size]="18"></lucide-icon>{{ 'DASHBOARD.AUTO_STR_271' | translate }}</button>
              <button
                class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                [ngClass]="previewMode === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'"
                (click)="previewMode = 'mobile'"
              >
                <lucide-icon name="smartphone" [size]="18"></lucide-icon>{{ 'DASHBOARD.AUTO_STR_272' | translate }}</button>
            </div>
          </div>

          <div class="flex flex-row-reverse items-center gap-2">
            <button class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors font-medium border border-gray-200 ml-4">{{ 'DASHBOARD.AUTO_STR_411' | translate }}<lucide-icon name="eye" [size]="18"></lucide-icon>
            </button>
            <button
              class="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title='DASHBOARD.AUTO_STR_424'
            >
              <lucide-icon name="undo-2" [size]="20"></lucide-icon>
            </button>
            <button
              class="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title='DASHBOARD.AUTO_STR_425'
            >
              <lucide-icon name="redo-2" [size]="20"></lucide-icon>
            </button>
            <button class="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 mr-2">
              <lucide-icon name="lock" [size]="16" class="mb-0.5"></lucide-icon>
              <span>{{ 'DASHBOARD.AUTO_STR_224' | translate }}</span>
            </button>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex flex-col lg:flex-row p-6 gap-8 items-start relative h-[calc(100vh-80px)] overflow-hidden">
          <!-- Editor Area (Right side in RTL) -->
          <div class="w-full lg:flex-1 h-full relative overflow-y-auto custom-scrollbar no-scrollbar rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
             <app-editor-router [currentRoute]="currentRoute"></app-editor-router>
          </div>

          <!-- Live Preview Area (Left side in RTL) -->
          <div class="w-full lg:w-[45%] flex-shrink-0 flex justify-center h-full overflow-hidden">
            <app-live-preview [mode]="previewMode"></app-live-preview>
          </div>
        </div>
      </div>
    </app-admin-layout>
  `
})
export class CustomizeHomePageComponent implements OnInit, OnDestroy {
  previewMode: 'mobile' | 'desktop' = 'mobile';
  currentRoute: string = '/';

  constructor(private zone: NgZone) {}

  private messageHandler = (event: MessageEvent) => {
    if (event.data?.type === 'STOREFRONT_ROUTE_CHANGE' && event.data.pathname) {
      this.zone.run(() => {
        this.currentRoute = event.data.pathname;
      });
    }
  };

  ngOnInit() {
    window.addEventListener('message', this.messageHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.messageHandler);
  }
}

