import { Component } from '@angular/core';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { AdminLayoutComponent } from '../../../shared/components/layout/admin-layout/admin-layout.component';

@Component({
  selector: 'app-accounts-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, AdminLayoutComponent],
  templateUrl: './accounts-page.component.html',
  styleUrls: ['./accounts-page.component.css']
})
export class AccountsPageComponent {

}
