import { Component } from '@angular/core';
import { HomeHeaderComponent } from '../home-header/home-header.component';

@Component({
  selector: 'app-store-header',
  standalone: true,
  imports: [HomeHeaderComponent],
  template: `<app-home-header></app-home-header>`,
  host: {
    style: 'display: block;'
  }
})
export class StoreHeaderComponent {

}
