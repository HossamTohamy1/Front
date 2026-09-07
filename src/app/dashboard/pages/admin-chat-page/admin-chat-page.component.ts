import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-chat-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, ],
  template: ''
})
export class AdminChatPageComponent implements OnInit {
  private router = inject(Router);

  ngOnInit() {
    this.router.navigate(['/admin'], { replaceUrl: true });
  }
}
