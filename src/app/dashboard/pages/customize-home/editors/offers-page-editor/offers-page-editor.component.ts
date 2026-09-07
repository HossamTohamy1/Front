import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OffersPageConfigService } from '../../../../../core/services/page-configs/offers-page-config.service';

@Component({
  selector: 'app-offers-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule],
  templateUrl: './offers-page-editor.component.html',
  styles: ``
})
export class OffersPageEditorComponent {
  private configService = inject(OffersPageConfigService);
  
  config = this.configService.pageConfig;

  updateConfig(key: string, value: any) {
    this.configService.updateConfig({
      ...this.config(),
      [key]: value
    });
  }
}
