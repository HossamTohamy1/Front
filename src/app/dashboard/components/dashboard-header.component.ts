import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
﻿import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Menu } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, LucideAngularModule],
  template: `
    <header class="dashboard-home__header">
      <button
        type="button"
        class="dashboard-home__menu"
        (click)="openMenu.emit()"
        [attr.aria-label]="'DASHBOARD.AUTO_STR_301' | translate"
      >
        <lucide-icon [img]="MenuIcon" [size]="27" strokeWidth="2"></lucide-icon>
      </button>

      <div class="dashboard-home__brand" aria-label="LOXX KING">
        <span class="dashboard-home__brand-primary">LOXX</span>
        <span class="dashboard-home__brand-secondary">KING</span>
      </div>

      <div class="dashboard-home__header-actions" [attr.aria-label]="'DASHBOARD.AUTO_STR_48' | translate">
        <button type="button" (click)="openPrices.emit()">{{ 'DASHBOARD.AUTO_STR_302' | translate }}</button>
        <button type="button" (click)="openProducts.emit()">{{ 'DASHBOARD.AUTO_STR_260' | translate }}</button>
        <button type="button" class="dashboard-home__approval-button" (click)="openApprovals.emit()">{{ 'DASHBOARD.AUTO_STR_340' | translate }}<span class="dashboard-number" *ngIf="pendingApprovalsCount > 0">{{ pendingApprovalsCount }}</span>
        </button>
      </div>
    </header>
  `,
})
export class DashboardHeaderComponent {
  readonly MenuIcon = Menu;
  @Input() pendingApprovalsCount = 0;
  @Output() openMenu = new EventEmitter<void>();
  @Output() openPrices = new EventEmitter<void>();
  @Output() openProducts = new EventEmitter<void>();
  @Output() openApprovals = new EventEmitter<void>();
}

