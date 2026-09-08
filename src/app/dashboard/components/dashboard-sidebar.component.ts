import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
﻿import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X, LayoutDashboard, Store, UserCog, Globe, Star, FileText, MessageSquare, Database, History, LogOut, ChevronLeft } from 'lucide-angular';
import { StaffAccount } from '../../domain/models/staff-account.model';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, LucideAngularModule],
  template: `
    <div class="dashboard-sidebar-layer" *ngIf="isOpen">
      <button
        type="button"
        class="dashboard-sidebar-layer__backdrop"
        (click)="close.emit()"
        [attr.aria-label]="'DASHBOARD.AUTO_STR_221' | translate"
      ></button>

      <aside class="dashboard-sidebar" dir="rtl" [attr.aria-label]="'DASHBOARD.AUTO_STR_20' | translate">
        <header class="dashboard-sidebar__header">
          <img src="assets/home/logo-header.png" alt="LOXX KING" />
          <button type="button" (click)="close.emit()" [attr.aria-label]="'COMMON.CLOSE' | translate">
            <lucide-icon [img]="XIcon" [size]="18"></lucide-icon>
          </button>
        </header>

        <div class="dashboard-sidebar__user">
          <small>{{ 'DASHBOARD.AUTO_STR_196' | translate }}</small>
          <strong>{{ activeAccount.name }}</strong>
        </div>

        <nav class="dashboard-sidebar__nav">
          <button type="button" class="dashboard-sidebar__nav-row is-active" (click)="navigate.emit('/admin')">
            <span class="dashboard-sidebar__nav-main">
              <lucide-icon [img]="LayoutDashboardIcon" [size]="17"></lucide-icon>
              <span>{{ 'DASHBOARD.AUTO_STR_175' | translate }}</span>
            </span>
            <lucide-icon [img]="ChevronLeftIcon" [size]="15"></lucide-icon>
          </button>

          <button type="button" class="dashboard-sidebar__nav-row" (click)="navigate.emit('/admin/store-customizer')">
            <span class="dashboard-sidebar__nav-main">
              <lucide-icon [img]="StoreIcon" [size]="17"></lucide-icon>
              <span>{{ 'DASHBOARD.AUTO_STR_265' | translate }}</span>
            </span>
            <lucide-icon [img]="ChevronLeftIcon" [size]="15"></lucide-icon>
          </button>

          <button type="button" class="dashboard-sidebar__nav-row" (click)="navigate.emit('/admin/accounts')">
            <span class="dashboard-sidebar__nav-main">
              <lucide-icon [img]="UserCogIcon" [size]="17"></lucide-icon>
              <span>{{ 'DASHBOARD.AUTO_STR_394' | translate }}</span>
            </span>
            <lucide-icon [img]="ChevronLeftIcon" [size]="15"></lucide-icon>
          </button>

          <button type="button" class="dashboard-sidebar__nav-row" (click)="navigate.emit('/')">
            <span class="dashboard-sidebar__nav-main">
              <lucide-icon [img]="GlobeIcon" [size]="17"></lucide-icon>
              <span>{{ 'DASHBOARD.AUTO_STR_129' | translate }}</span>
            </span>
            <lucide-icon [img]="ChevronLeftIcon" [size]="15"></lucide-icon>
          </button>

          <button type="button" class="dashboard-sidebar__nav-row" (click)="navigate.emit('/admin/reviews')">
            <span class="dashboard-sidebar__nav-main">
              <lucide-icon [img]="StarIcon" [size]="17"></lucide-icon>
              <span>{{ 'PRODUCT.REVIEWS' | translate }}</span>
            </span>
            <lucide-icon [img]="ChevronLeftIcon" [size]="15"></lucide-icon>
          </button>

          <button type="button" class="dashboard-sidebar__nav-row" (click)="navigate.emit('/admin/invoices')">
            <span class="dashboard-sidebar__nav-main">
              <lucide-icon [img]="FileTextIcon" [size]="17"></lucide-icon>
              <span>{{ 'COMMON.INVOICES' | translate }}</span>
            </span>
            <lucide-icon [img]="ChevronLeftIcon" [size]="15"></lucide-icon>
          </button>

          <button type="button" class="dashboard-sidebar__nav-row" (click)="navigate.emit('/admin/notifications')">
            <span class="dashboard-sidebar__nav-main">
              <lucide-icon [img]="MessageSquareIcon" [size]="17"></lucide-icon>
              <span>{{ 'NOTIFICATIONS.TITLE' | translate }}</span>
            </span>
            <lucide-icon [img]="ChevronLeftIcon" [size]="15"></lucide-icon>
          </button>

          <button type="button" class="dashboard-sidebar__nav-row" (click)="navigate.emit('/admin/operations')">
            <span class="dashboard-sidebar__nav-main">
              <lucide-icon [img]="DatabaseIcon" [size]="17"></lucide-icon>
              <span>{{ 'DASHBOARD.AUTO_STR_222' | translate }}</span>
            </span>
            <lucide-icon [img]="ChevronLeftIcon" [size]="15"></lucide-icon>
          </button>

          <button type="button" class="dashboard-sidebar__nav-row" (click)="navigate.emit('/admin/edit-logs')">
            <span class="dashboard-sidebar__nav-main">
              <lucide-icon [img]="HistoryIcon" [size]="17"></lucide-icon>
              <span>{{ 'COMMON.EDITLOGS' | translate }}</span>
            </span>
            <lucide-icon [img]="ChevronLeftIcon" [size]="15"></lucide-icon>
          </button>
        </nav>

        <button type="button" class="dashboard-sidebar__logout" (click)="logout.emit()">
          <span>{{ 'DASHBOARD.AUTO_STR_445' | translate }}</span>
          <lucide-icon [img]="LogOutIcon" [size]="17"></lucide-icon>
        </button>
      </aside>
    </div>
  `,
})
export class DashboardSidebarComponent {
  readonly XIcon = X;
  readonly LayoutDashboardIcon = LayoutDashboard;
  readonly StoreIcon = Store;
  readonly UserCogIcon = UserCog;
  readonly GlobeIcon = Globe;
  readonly StarIcon = Star;
  readonly FileTextIcon = FileText;
  readonly MessageSquareIcon = MessageSquare;
  readonly DatabaseIcon = Database;
  readonly HistoryIcon = History;
  readonly LogOutIcon = LogOut;
  readonly ChevronLeftIcon = ChevronLeft;

  @Input() isOpen = false;
  @Input() activeAccount!: StaffAccount;
  @Output() close = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();
}

