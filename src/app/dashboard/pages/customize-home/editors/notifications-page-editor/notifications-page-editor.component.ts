import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationsPageConfigService } from '../../../../../core/services/page-configs/notifications-page-config.service';

@Component({
  selector: 'app-notifications-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule],
  templateUrl: './notifications-page-editor.component.html',
  styles: ``
})
export class NotificationsPageEditorComponent {
  private configService = inject(NotificationsPageConfigService);
  
  config = this.configService.pageConfig;

  updateConfig(key: string, value: any) {
    this.configService.updateConfig({
      ...this.config(),
      [key]: value
    });
  }
}
