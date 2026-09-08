import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from '../../../shared/components/layout/admin-layout/admin-layout.component';
import { LangService } from '../../../core/services/lang/lang.service';
import { LucideAngularModule, Package, Users, Star, ShoppingBag } from 'lucide-angular';

interface AdminNotification {
  id: string;
  icon: any;
  color: string;
  titleEn: string;
  titleAr: string;
  msgEn: string;
  msgAr: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-admin-notifications-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, AdminLayoutComponent, LucideAngularModule],
  templateUrl: './admin-notifications-page.component.html',
  styleUrls: ['./admin-notifications-page.component.css']
})
export class AdminNotificationsPageComponent {
  readonly PackageIcon = Package;
  readonly UsersIcon = Users;
  readonly StarIcon = Star;
  readonly ShoppingBagIcon = ShoppingBag;

  adminNotifs: AdminNotification[] = [
    { id: '1', icon: ShoppingBag, color: 'text-brand bg-secondary', titleEn: 'New Order Received', titleAr: 'DASHBOARD.AUTO_STR_381', msgEn: 'Order #LK-2025-1848 from Maria Santos', msgAr: 'طلب #LK-2025-1848 من ماريا سانتوس', time: '2 min ago', read: false },
    { id: '2', icon: Users, color: 'text-green-600 bg-green-50 dark:bg-green-900/20', titleEn: 'New Customer', titleAr: 'DASHBOARD.AUTO_STR_315', msgEn: 'Jessica Lee just registered', msgAr: 'DASHBOARD.AUTO_STR_56', time: '15 min ago', read: false },
    { id: '3', icon: Star, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20', titleEn: 'New Review', titleAr: 'DASHBOARD.AUTO_STR_346', msgEn: '5★ review on Pro Waist Cincher Elite', msgAr: 'DASHBOARD.AUTO_STR_17', time: '1 hour ago', read: true },
    { id: '4', icon: Package, color: 'text-red-600 bg-red-50 dark:bg-red-900/20', titleEn: 'Low Stock Alert', titleAr: 'DASHBOARD.AUTO_STR_133', msgEn: 'Lace Trim Bodysuit has only 5 units left', msgAr: 'بودي سوت الدانتيل — ٥ قطع فقط', time: '2 hours ago', read: true },
    { id: '5', icon: ShoppingBag, color: 'text-brand bg-secondary', titleEn: 'New Order', titleAr: 'DASHBOARD.AUTO_STR_381', msgEn: 'Order #LK-2025-1847 placed', msgAr: 'تم تقديم طلب #LK-2025-1847', time: '3 hours ago', read: true },
  ];

  private langService = inject(LangService);
  lang = this.langService.lang;

  unreadCount = computed(() => {
    return this.adminNotifs.filter(n => !n.read).length;
  });

  
}
