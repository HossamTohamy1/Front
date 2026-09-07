import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderConfirmationPageConfigService } from '../../../../../core/services/page-configs/order-confirmation-page-config.service';

@Component({
  selector: 'app-order-confirmation-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule],
  templateUrl: './order-confirmation-page-editor.component.html',
  styles: ``
})
export class OrderConfirmationPageEditorComponent {
  private configService = inject(OrderConfirmationPageConfigService);
  
  config = this.configService.pageConfig;

  updateConfig(key: string, value: any) {
    this.configService.updateConfig({
      ...this.config(),
      [key]: value
    });
  }
}
