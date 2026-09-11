import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-staff-dashboard-menu-item',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterLink, LucideAngularModule],
  template: `
    @if (isAdmin || knownStaffDevice) {
      <a
        [routerLink]="destination"
        class="lk-staff-dashboard-item"
        (click)="onNavigate.emit()"
      >
        <span class="lk-staff-dashboard-item__icon" aria-hidden="true">
          <lucide-icon [img]="LayoutDashboardIcon" [size]="24" [strokeWidth]="1.8"></lucide-icon>
        </span>

        <span class="lk-staff-dashboard-item__copy">
          <strong>{{ 'COMMON.DASHBOARD' | translate }}</strong>
          <small>{{ (isAdmin ? 'STOREFRONT.AUTO_STR_137' : 'STOREFRONT.AUTO_STR_182') | translate }}</small>
        </span>

        <lucide-icon
          [img]="ChevronRightIcon"
          class="lk-staff-dashboard-item__arrow rtl-flip"
          [size]="18"
          [strokeWidth]="1.8"
          aria-hidden="true"
        ></lucide-icon>
      </a>
    }
  `,
  host: {
    style: 'display: block;'
  }
})
export class StaffDashboardMenuItemComponent {
  @Output() onNavigate = new EventEmitter<void>();

  readonly LayoutDashboardIcon = LayoutDashboard;
  readonly ChevronRightIcon = ChevronRight;

  isAdmin = false;
  knownStaffDevice = false;

  get destination(): string {
    return this.isAdmin ? '/admin/store-customizer' : '/admin/login';
  }
}
