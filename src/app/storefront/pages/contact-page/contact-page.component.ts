import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HomeHeaderComponent } from '../../../shared/components/layout/home-header/home-header.component';
import { ContactPageConfigService } from '../../../core/services/config/contact-page-config.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import {
  LucideAngularModule,
  ArrowLeft,
  ChevronLeft,
  Grid2X2,
  Heart,
  Home,
  Mail,
  MoreHorizontal,
  PencilLine,
  Phone,
  Send,
  User,
  UserRound
} from 'lucide-angular';

type ContactMethodDef = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  external?: boolean;
  ltr?: boolean;
};

type ContactFormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, 
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    StoreLayoutComponent,
    HomeHeaderComponent,
    LucideAngularModule
  ],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent {
  private configService = inject(ContactPageConfigService);
  private toastService = inject(ToastService);
  location = inject(Location);
  
  readonly ArrowLeft = ArrowLeft;
  readonly ChevronLeft = ChevronLeft;
  readonly Grid2X2 = Grid2X2;
  readonly Heart = Heart;
  readonly HomeIcon = Home;
  readonly Mail = Mail;
  readonly MoreHorizontal = MoreHorizontal;
  readonly PencilLine = PencilLine;
  readonly Phone = Phone;
  readonly Send = Send;
  readonly User = User;
  readonly UserRound = UserRound;

  get config() {
    return this.configService.config();
  }

  contactPlant = 'assets/contact/contact-plant.png';
  contactChatBubble = 'assets/contact/contact-chat-bubble.png';
  contactWhatsappBanner = 'assets/contact/contact-whatsapp-banner.png';

  contactMethods: ContactMethodDef[] = [
    {
        id: 'whatsapp',
        title: 'CONTACT.WHATSAPP',
        subtitle: '+966 50 123 4567',
        href: 'https://wa.me/966501234567',
        icon: 'assets/contact/contact-whatsapp.png',
        external: true,
        ltr: true,
    },
    {
        id: 'phone',
        title: 'CHECKOUT.PHONE',
        subtitle: '+966 50 123 4567',
        href: 'tel:+966501234567',
        icon: 'assets/contact/contact-phone.png',
        ltr: true,
    },
    {
        id: 'email',
        title: 'CONTACT.EMAIL',
        subtitle: 'support@loxxking.com',
        href: 'mailto:support@loxxking.com',
        icon: 'assets/contact/contact-mail.png',
        ltr: true,
    },
    {
        id: 'hours',
        title: 'STOREFRONT.AUTO_STR_363',
        subtitle: 'يوميًا من 9:00 صباحًا إلى 10:00 مساءً',
        href: '#contact-form',
        icon: 'assets/contact/contact-clock.png',
    },
  ];

  mobileNavigation = [
    { to: '/profile', label: 'STOREFRONT.AUTO_STR_457', icon: this.UserRound },
    { to: '/favorites', label: 'FAVORITES.TITLE', icon: this.Heart },
    { to: '/', label: 'NAV.HOME', icon: this.HomeIcon },
    { to: '/categories', label: 'COMMON.CATEGORIESMANAGEMENT', icon: this.Grid2X2 },
    { to: '/contact', label: 'SHARED.AUTO_STR_84', icon: this.MoreHorizontal, active: true },
  ];

  form: ContactFormState = {
    name: '',
    phone: '',
    email: '',
    message: '',
  };

  submitContactForm(contactForm: NgForm) {
    if (!this.form.name.trim() || !this.form.phone.trim() || !this.form.email.trim() || !this.form.message.trim()) {
        this.toastService.showToast('STOREFRONT.AUTO_STR_109', 'info');
        return;
    }

    this.toastService.showToast('STOREFRONT.AUTO_STR_164', 'success');
    this.form = { name: '', phone: '', email: '', message: '' };
    contactForm.resetForm();
  }
}
