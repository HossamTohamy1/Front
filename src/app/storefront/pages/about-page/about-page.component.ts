import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HomeHeaderComponent } from '../../../shared/components/layout/home-header/home-header.component';
import { AboutPageConfigService, AboutPageConfig } from './about-page-config.service';
import { LangService } from '../../../core/services/lang/lang.service';
import { LucideAngularModule, ChevronLeft, ChevronRight, ShieldCheck, Check, Star, Eye, Target, Mail, Phone } from 'lucide-angular';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, 
    CommonModule, 
    RouterModule, 
    StoreLayoutComponent, 
    HomeHeaderComponent, 
    LucideAngularModule
  ],
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent implements OnInit {
  config!: AboutPageConfig;
  
  readonly langService = inject(LangService);
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly ShieldCheck = ShieldCheck;
  readonly Check = Check;
  readonly Star = Star;
  readonly Eye = Eye;
  readonly Target = Target;
  readonly Mail = Mail;
  readonly Phone = Phone;

  logoImg = 'assets/home/logo-header.png';
  facebookIcon = 'assets/about/facebook.svg';
  whatsappIcon = 'assets/about/whatsapp.svg';

  constructor(private configService: AboutPageConfigService) {}

  ngOnInit(): void {
    this.configService.config$.subscribe(config => {
      this.config = config;
    });
  }

  replaceNewlines(text: string, withBr: string = '<br />'): string {
    if (!text) return '';
    return text.replace(/\\n|\n/g, withBr);
  }
}
