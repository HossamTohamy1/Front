import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
﻿import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, History, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-angular';
import { ARABIC_MONTH_NAMES, DASHBOARD_WEEK_DAYS } from '../../shared/utils/date.utils';

@Component({
  selector: 'app-dashboard-table-tools',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule],
  template: `
    <section class="dashboard-table-tools">
      <div class="dashboard-entries">
        <span>أظهر:</span>
        <select [ngModel]="itemsPerPage" (ngModelChange)="itemsPerPageChange.emit($event)">
          <option [ngValue]="10">10</option>
          <option [ngValue]="20">20</option>
          <option [ngValue]="50">50</option>
          <option [ngValue]="100">100</option>
        </select>
        <span>{{ 'DASHBOARD.AUTO_STR_410' | translate }}</span>
      </div>

      <div class="dashboard-search">
        <lucide-icon [img]="HistoryIcon" [size]="16" strokeWidth="2.1" aria-hidden="true"></lucide-icon>
        <input
          [ngModel]="searchQuery"
          (ngModelChange)="searchQueryChange.emit($event)"
          [placeholder]="'DASHBOARD.AUTO_STR_176' | translate"
          [attr.aria-label]="'DASHBOARD.AUTO_STR_159' | translate"
        />
      </div>

      <div class="dashboard-date-filter-wrap">
        <button type="button" class="dashboard-date-filter" (click)="toggleDatePicker.emit()">
          <span>{{ selectedDate || ('DASHBOARD.AUTO_STR_160' | translate) }}</span>
        </button>

        <div class="dashboard-date-picker" *ngIf="isDatePickerOpen" role="dialog" [attr.aria-label]="'DASHBOARD.AUTO_STR_197' | translate">
          <aside class="dashboard-date-picker__preset">
            <div class="dashboard-date-picker__preset-card" (click)="clearDate.emit()">
              <lucide-icon [img]="ChevronDownIcon" [size]="25" strokeWidth="2.4"></lucide-icon>
              <span><small>{{ 'DASHBOARD.AUTO_STR_312' | translate }}</small><strong>{{ 'DASHBOARD.AUTO_STR_313' | translate }}</strong></span>
            </div>
          </aside>

          <div class="dashboard-date-picker__calendar">
            <div class="dashboard-date-picker__calendar-head">
              <h3><span>{{ arabicMonthNames[calendarMonth] }}</span> <b class="dashboard-number">{{ calendarYear }}</b></h3>
              <div class="dashboard-date-picker__navigation">
                <button type="button" (click)="changeMonth.emit(-1)" [attr.aria-label]="'DASHBOARD.AUTO_STR_266' | translate">
                  <lucide-icon [img]="ChevronLeftIcon" [size]="25" strokeWidth="2"></lucide-icon>
                </button>
                <button type="button" (click)="changeMonth.emit(1)" [attr.aria-label]="'DASHBOARD.AUTO_STR_267' | translate">
                  <lucide-icon [img]="ChevronRightIcon" [size]="25" strokeWidth="2"></lucide-icon>
                </button>
              </div>
            </div>

            <div class="dashboard-date-picker__weekdays">
              <span *ngFor="let dayName of dashboardWeekDays">{{ dayName }}</span>
            </div>

            <div class="dashboard-date-picker__days">
              <ng-container *ngFor="let day of calendarCells">
                <span *ngIf="day === null" aria-hidden="true"></span>
                <button
                  *ngIf="day !== null"
                  type="button"
                  [class.dashboard-date-picker__day--selected]="isDaySelected(day)"
                  (click)="selectDate.emit(day)"
                >
                  <span class="dashboard-number">{{ day }}</span>
                </button>
              </ng-container>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class DashboardTableToolsComponent {
  readonly HistoryIcon = History;
  readonly ChevronDownIcon = ChevronDown;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;

  readonly arabicMonthNames = ARABIC_MONTH_NAMES;
  readonly dashboardWeekDays = DASHBOARD_WEEK_DAYS;

  @Input() itemsPerPage = 10;
  @Input() searchQuery = '';
  @Input() selectedDate = '';
  @Input() isDatePickerOpen = false;
  @Input() calendarYear = new Date().getFullYear();
  @Input() calendarMonth = new Date().getMonth();
  @Input() calendarCells: (number | null)[] = [];

  @Output() itemsPerPageChange = new EventEmitter<number>();
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() toggleDatePicker = new EventEmitter<void>();
  @Output() clearDate = new EventEmitter<void>();
  @Output() changeMonth = new EventEmitter<number>();
  @Output() selectDate = new EventEmitter<number>();

  isDaySelected(day: number): boolean {
    const m = this.calendarMonth < 9 ? `0${this.calendarMonth + 1}` : `${this.calendarMonth + 1}`;
    const d = day < 10 ? `0${day}` : `${day}`;
    return this.selectedDate === `${this.calendarYear}-${m}-${d}`;
  }
}

