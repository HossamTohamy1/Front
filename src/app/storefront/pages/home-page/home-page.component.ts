import { Component, OnInit, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageConfigService } from '../../../core/services/config/home-page-config.service';
import { PageConfig } from '../../../core/models/config.model';

import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HomeHeaderComponent } from '../../../shared/components/layout/home-header/home-header.component';

import { HeroComponent } from '../../components/home/hero/hero.component';
import { BenefitsComponent } from '../../components/home/benefits/benefits.component';
import { CategoriesComponent } from '../../components/home/categories/categories.component';
import { ProductsComponent } from '../../components/home/products/products.component';
import { OfferComponent } from '../../components/home/offer/offer.component';
import { TestimonialsComponent } from '../../components/home/testimonials/testimonials.component';
import { FaqComponent } from '../../components/home/faq/faq.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    StoreLayoutComponent,
    HomeHeaderComponent,
    HeroComponent,
    BenefitsComponent,
    CategoriesComponent,
    ProductsComponent,
    OfferComponent,
    TestimonialsComponent,
    FaqComponent
  ],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {
  private configService = inject(HomePageConfigService);
  
  pageConfig: Signal<PageConfig> = this.configService.pageConfig;

  ngOnInit() {
  }
}
