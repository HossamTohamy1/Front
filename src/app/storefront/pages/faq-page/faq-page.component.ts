import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HomeHeaderComponent } from '../../../shared/components/layout/home-header/home-header.component';
import { FaqComponent } from '../../components/home/faq/faq.component';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [CommonModule, StoreLayoutComponent, HomeHeaderComponent, FaqComponent],
  templateUrl: './faq-page.component.html',
  styleUrl: './faq-page.component.css'
})
export class FaqPageComponent {

}
