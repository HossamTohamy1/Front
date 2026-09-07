import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Star } from 'lucide-angular';

interface Testimonial {
    id: number;
    name: string;
    message: string;
    rating: number;
    avatar: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  readonly Star = Star;
  activeIndex = 0;
  private intervalId: any;

  testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'DASHBOARD.AUTO_STR_368',
        message: 'STOREFRONT.AUTO_STR_15',
        rating: 5,
        avatar: 'assets/home/testimonial-customer-1.webp',
    },
    {
        id: 2,
        name: 'STOREFRONT.AUTO_STR_417',
        message: 'STOREFRONT.AUTO_STR_16',
        rating: 5,
        avatar: 'assets/home/testimonial-customer-2.webp',
    },
    {
        id: 3,
        name: 'STOREFRONT.AUTO_STR_434',
        message: 'STOREFRONT.AUTO_STR_24',
        rating: 5,
        avatar: 'assets/home/testimonial-customer-3.webp',
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get activeTestimonial() {
    return this.testimonials[this.activeIndex];
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = setInterval(() => {
        this.activeIndex = (this.activeIndex + 1) % this.testimonials.length;
      }, 4500);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  showPrevious() {
    this.activeIndex = (this.activeIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  showNext() {
    this.activeIndex = (this.activeIndex + 1) % this.testimonials.length;
  }

  setActiveIndex(index: number) {
    this.activeIndex = index;
  }
}
