import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreHeaderComponent } from '../store-header/store-header.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { FloatingChatComponent } from '../floating-chat/floating-chat.component';
@Component({
  selector: 'app-store-layout',
  standalone: true,
  imports: [CommonModule, StoreHeaderComponent, BottomNavComponent, FloatingChatComponent],
  template: `
    <div class="min-h-screen bg-background text-foreground">
      <ng-container *ngIf="hasCustomHeader; else defaultHeader">
        <ng-content select="[header]"></ng-content>
      </ng-container>
      <ng-template #defaultHeader>
        <app-store-header></app-store-header>
      </ng-template>

      <main [class.pb-20]="showBottomNav" [class.md:pb-0]="showBottomNav">
        <ng-content></ng-content>
      </main>

      <app-bottom-nav *ngIf="showBottomNav"></app-bottom-nav>
      <app-floating-chat></app-floating-chat>
    </div>
  `,
  host: {
    style: 'display: block;'
  }
})
export class StoreLayoutComponent {
  @Input() showBottomNav = true;
  @Input() showFloatingChat = true;
  @Input() hasCustomHeader = false;
}
