import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { 
  LucideAngularModule, 
  ShieldCheck, 
  UserRound, 
  FileText, 
  LockKeyhole, 
  UsersRound, 
  BadgeCheck, 
  Truck, 
  Clock3, 
  CreditCard, 
  MapPin, 
  Info, 
  PackageOpen, 
  CalendarDays, 
  RefreshCcw, 
  FileCheck2, 
  Monitor, 
  Landmark, 
  Tags, 
  CircleAlert, 
  PencilLine, 
  ChevronLeft, 
  ShoppingCart 
} from 'lucide-angular';

import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HomeHeaderComponent } from '../../../shared/components/layout/home-header/home-header.component';

type PolicyKey = 'privacy' | 'shipping' | 'returns' | 'terms';

type PolicySection = {
    title: string;
    description: string;
    icon: any;
    bullets?: string[];
};

type PolicyDefinition = {
    key: PolicyKey;
    title: string;
    subtitle: string;
    gridTitle: string;
    gridDescription: string;
    icon: any;
    heroIcon: any;
    sections: PolicySection[];
    showWhatsApp?: boolean;
};

const policies: PolicyDefinition[] = [
    {
        key: 'privacy',
        title: 'POLICIES.PRIVACY',
        subtitle: 'نحن في لوكس كينج نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.',
        gridTitle: 'POLICIES.PRIVACY',
        gridDescription: 'STOREFRONT.AUTO_STR_156',
        icon: ShieldCheck,
        heroIcon: ShieldCheck,
        sections: [
            {
                title: 'STOREFRONT.AUTO_STR_166',
                description: 'نجمع فقط المعلومات الضرورية لإتمام طلبك وتقديم خدمة أفضل لك.',
                icon: UserRound,
            },
            {
                title: 'STOREFRONT.AUTO_STR_212',
                description: 'نستخدم معلوماتك فقط لمعالجة طلباتك، والتواصل معك، وتقديم الدعم.',
                icon: FileText,
            },
            {
                title: 'STOREFRONT.AUTO_STR_252',
                description: 'نستخدم تقنيات أمان متقدمة لحماية بياناتك من الوصول غير المصرح به.',
                icon: LockKeyhole,
            },
            {
                title: 'STOREFRONT.AUTO_STR_233',
                description: 'لا نقوم ببيع أو مشاركة بياناتك مع أي جهة خارجية إلا في حالات الشحن والدفع.',
                icon: UsersRound,
            },
            {
                title: 'STOREFRONT.AUTO_STR_464',
                description: 'يمكنك طلب تعديل أو حذف بياناتك في أي وقت عبر التواصل معنا.',
                icon: BadgeCheck,
            },
        ],
    },
    {
        key: 'shipping',
        title: 'STOREFRONT.AUTO_STR_176',
        subtitle: 'نحرص على توصيل طلبك بأسرع وقت وبأفضل خدمة.',
        gridTitle: 'STOREFRONT.AUTO_STR_372',
        gridDescription: 'STOREFRONT.AUTO_STR_177',
        icon: Truck,
        heroIcon: Truck,
        sections: [
            {
                title: 'STOREFRONT.AUTO_STR_373',
                description: 'من 2 إلى 3 أيام عمل داخل المدن، ومن 2 إلى 5 أيام عمل للمناطق الأخرى.',
                icon: Clock3,
            },
            {
                title: 'DASHBOARD.AUTO_STR_354',
                description: 'رسوم الشحن تُحسب عند إتمام الطلب وتختلف حسب المدينة والمنطقة.',
                icon: CreditCard,
            },
            {
                title: 'STOREFRONT.AUTO_STR_397',
                description: 'يمكنك تتبع طلبك من خلال صفحة تتبع الطلب باستخدام رقم الطلب ورقم الهاتف.',
                icon: MapPin,
            },
            {
                title: 'STOREFRONT.AUTO_STR_337',
                description: 'في حال تأخر الطلب عن المدة المتوقعة، سنتواصل معك في أقرب وقت ممكن.',
                icon: Info,
            },
        ],
    },
    {
        key: 'returns',
        title: 'POLICIES.RETURNS_POLICY',
        subtitle: 'نحرص على رضاك التام، لذلك نوفر لك سياسة استبدال واسترجاع سهلة وواضحة.',
        gridTitle: 'POLICIES.RETURNS_POLICY',
        gridDescription: 'STOREFRONT.AUTO_STR_130',
        icon: PackageOpen,
        heroIcon: PackageOpen,
        sections: [
            {
                title: 'STOREFRONT.AUTO_STR_131',
                description: 'يمكنك الاستبدال أو الاسترجاع خلال 7 أيام من تاريخ استلام الطلب.',
                icon: CalendarDays,
            },
            {
                title: 'POLICIES.EXCHANGE_TERMS',
                description: '',
                icon: ShieldCheck,
                bullets: [
                    'أن يكون المنتج غير مستخدم.',
                    'أن يكون في عبوته الأصلية مع جميع الملحقات.',
                    'عدم نزع الملصقات أو غسيل المنتج.',
                ],
            },
            {
                title: 'STOREFRONT.AUTO_STR_253',
                description: '',
                icon: RefreshCcw,
                bullets: [
                    'وصول منتج مختلف عن الطلب.',
                    'وجود عيب في المنتج.',
                    'تلف المنتج أثناء الشحن.',
                ],
            },
            {
                title: 'STOREFRONT.AUTO_STR_254',
                description: 'في حال كان سبب الاسترجاع من طرفنا (خطأ أو عيب)، نتحمل نحن تكلفة الشحن.',
                icon: Truck,
            },
        ],
        showWhatsApp: true,
    },
    {
        key: 'terms',
        title: 'STOREFRONT.AUTO_STR_249',
        subtitle: 'باستخدامك لموقع لوكس كينج، فإنك توافق على الشروط والأحكام التالية.',
        gridTitle: 'STOREFRONT.AUTO_STR_249',
        gridDescription: 'STOREFRONT.AUTO_STR_178',
        icon: FileCheck2,
        heroIcon: FileCheck2,
        sections: [
            {
                title: 'STOREFRONT.AUTO_STR_279',
                description: 'يسمح باستخدام الموقع لشراء المنتجات الشخصية فقط، ويمنع أي استخدام تجاري أو غير قانوني.',
                icon: Monitor,
            },
            {
                title: 'STOREFRONT.AUTO_STR_280',
                description: 'جميع الطلبات تخضع للتوفر، ويجب تقديم معلومات صحيحة وكاملة، والدفع يتم حسب طريقة الدفع المختارة.',
                icon: Landmark,
            },
            {
                title: 'STOREFRONT.AUTO_STR_255',
                description: 'الأسعار قابلة للتغيير دون إشعار مسبق، والعروض قابلة للتعديل وفقًا لسياسة المتجر.',
                icon: Tags,
            },
            {
                title: 'STOREFRONT.AUTO_STR_427',
                description: 'لا نتحمل أي مسؤولية عن سوء استخدام المنتجات بعد الاستلام أو أي أضرار غير ناتجة عن عيب مصنعي.',
                icon: CircleAlert,
            },
            {
                title: 'STOREFRONT.AUTO_STR_338',
                description: 'نحتفظ بحق تعديل هذه الشروط في أي وقت، ويعد استمرارك في استخدام الموقع موافقة على التحديثات.',
                icon: PencilLine,
            },
        ],
    },
];

@Component({
  selector: 'app-policies-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterModule, LucideAngularModule, StoreLayoutComponent, HomeHeaderComponent],
  templateUrl: './policies-page.component.html'
})
export class PoliciesPageComponent implements OnInit {
  policies = policies;
  selectedPolicy: PolicyDefinition | null = null;
  cartCount: number = 0; // Mocked cart count as we don't have AppContext
  logoHeader = 'assets/home/logo-header.png'; // Assuming asset path

  readonly ChevronLeft = ChevronLeft;
  readonly ShoppingCart = ShoppingCart;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const requestedPolicy = params['view'];
      this.selectedPolicy = requestedPolicy 
        ? this.policies.find(p => p.key === requestedPolicy) || null 
        : null;
    });
  }

  selectPolicy(key: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: key },
      queryParamsHandling: 'merge',
    }).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  goBack(): void {
    if (this.selectedPolicy) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {}
      }).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      return;
    }

    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
