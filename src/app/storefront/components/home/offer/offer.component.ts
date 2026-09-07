import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterModule],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})
export class OfferComponent {
  @Input() config?: any;

  get displayImage() {
    return this.config?.image || 'assets/home/offer-products-exact.png';
  }
}
