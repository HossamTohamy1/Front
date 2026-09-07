import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-login-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ????? ?????? ????? ??????
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" (ngSubmit)="onSubmit()">
            <div *ngIf="error" class="bg-red-50 border-r-4 border-red-500 p-4 mb-4">
              <div class="flex">
                <div class="ml-3">
                  <p class="text-sm text-red-700">{{ error }}</p>
                </div>
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                ?????? ??????????
              </label>
              <div class="mt-1">
                <input id="email" name="email" type="email" autocomplete="email" required
                  [(ngModel)]="email"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm text-left dir-ltr"
                  placeholder="admin@loxxking.com">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                ???? ??????
              </label>
              <div class="mt-1 relative">
                <input [type]="showPassword ? 'text' : 'password'" id="password" name="password" required
                  [(ngModel)]="password"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm text-left dir-ltr">
                <button type="button" (click)="togglePassword()" class="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <lucide-icon [name]="showPassword ? 'EyeOff' : 'Eye'" class="h-5 w-5 text-gray-400"></lucide-icon>
                </button>
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="loading || !email || !password"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50">
                <span *ngIf="loading" class="mr-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? '???? ????? ??????...' : '????? ??????' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminLoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  email = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = '?????? ????? ?????? ?????????? ????? ??????';
      return;
    }

    this.error = '';
    this.loading = true;

    this.http.post<any>('/api/users/login', { email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        const token = res?.data?.token || res?.token;
        const userId = res?.data?.userId || res?.userId;
        const role = res?.data?.role || res?.role || 'admin';
        
        if (token) { localStorage.setItem('lk-auth-token', token); }
        
        this.http.get<any>('/api/users/me', { headers: { Authorization: 'Bearer ' + token } }).subscribe({
          next: (meRes: any) => {
            const profile = meRes?.data || meRes;
            this.authService.setUser({
              id: userId,
              name: profile?.name || this.getEmployeeNameFromEmail(this.email),
              email: profile?.email || this.email,
              role: role.toLowerCase(),
            });
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
            this.router.navigateByUrl(returnUrl, { replaceUrl: true });
            this.loading = false;
          },
          error: (err: any) => {
            this.loading = false;
            this.error = 'Failed to load user profile.';
          }
        });
      },
      error: (err: any) => {
        this.loading = false;
        this.error = 'Invalid credentials or server error.';
      }
    });
  }

  private getEmployeeNameFromEmail(email: string): string {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[\.\-_]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
