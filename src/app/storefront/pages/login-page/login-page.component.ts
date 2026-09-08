import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, Eye, EyeOff, Heart, Lock, Mail, ShieldCheck } from 'lucide-angular';
import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth/auth.service';

export type LoginBenefit = { id: string; title: string; line1: string; line2: string; };
export type LoginPageConfig = { heroTitlePrefix: string; heroTitleHighlight: string; heroSubtitle: string; welcomeTitle: string; welcomeSubtitle: string; showSocialLogin: boolean; benefits: LoginBenefit[]; heroImage: string; };

const DEFAULT_CONFIG: LoginPageConfig = {
  heroTitlePrefix: '???? ???? ??',
  heroTitleHighlight: '?????',
  heroSubtitle: '????? ????? ?????? ?????\n?????? ?????? ?? ?? ????.',
  welcomeTitle: '????? ??????',
  welcomeSubtitle: '?????? ?? ??? ???? ?? LOXX KING',
  showSocialLogin: true,
  heroImage: '',
  benefits: [
    { id: '1', title: '??? ??????', line1: '????? ???????', line2: '????? ?????? ??????' },
    { id: '2', title: '??????? ???', line1: '????? ???????', line2: '???? ?????' },
    { id: '3', title: '????? ????', line1: '????? ???????', line2: '?? ???????' },
    { id: '4', title: '??? ???????', line1: '??? ??? ????????', line2: '?? ?? ???' },
  ],
};

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterModule, FormsModule, LucideAngularModule, StoreLayoutComponent],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  pageConfig = signal<LoginPageConfig>(DEFAULT_CONFIG);
  readonly ArrowLeft = ArrowLeft; readonly Eye = Eye; readonly EyeOff = EyeOff; readonly Heart = Heart; readonly Lock = Lock; readonly Mail = Mail; readonly ShieldCheck = ShieldCheck;
  logoImage = 'assets/login/loxx-login-logo.png';
  sceneImage = 'assets/login/loxx-login-scene.png';
  googleIcon = 'assets/login/google-login.png';
  appleIcon = 'assets/login/apple-login.png';
  facebookIcon = 'assets/login/facebook-login.png';

  showPassword = signal(false);
  isSubmitting = signal(false);
  form = { email: '', password: '', remember: false };

  ngOnInit() {
    const rememberedEmail = window.localStorage.getItem('loxx-remembered-email');
    if (rememberedEmail) { this.form.email = rememberedEmail; this.form.remember = true; }
    const saved = localStorage.getItem('loxx-login-config');
    if (saved) { try { this.pageConfig.set({ ...DEFAULT_CONFIG, ...JSON.parse(saved) }); } catch (e) { console.error('Failed to parse login config', e); } }
  }

  togglePassword() { this.showPassword.update(v => !v); }

  handleSubmit(event: Event) {
    event.preventDefault();
    if (!this.form.email.trim() || !this.form.password.trim()) return;

    if (this.form.remember) { window.localStorage.setItem('loxx-remembered-email', this.form.email.trim()); }
    else { window.localStorage.removeItem('loxx-remembered-email'); }

    this.isSubmitting.set(true);

    this.http.post<any>('/api/users/login', { email: this.form.email.trim(), password: this.form.password.trim() }).subscribe({
      next: (res: any) => {
        const token = res?.data?.token || res?.token;
        const userId = res?.data?.userId || res?.userId;
        const role = res?.data?.role || res?.role || 'customer';
        
        if (token) { localStorage.setItem('lk-auth-token', token); }
        
        this.http.get<any>('/api/users/me', { headers: { Authorization: 'Bearer ' + token } }).subscribe({
          next: (meRes: any) => {
            const profile = meRes?.data || meRes;
            this.authService.setUser({
              id: userId,
              name: profile?.name || this.form.email.trim().split('@')[0],
              email: profile?.email || this.form.email.trim(),
              role: role.toLowerCase(),
            });
            this.isSubmitting.set(false);
            this.router.navigate(['/']);
          },
          error: (err: any) => {
            this.isSubmitting.set(false);
            console.error(err);
          }
        });
      },
      error: (err: any) => {
        this.isSubmitting.set(false);
        console.error(err);
      }
    });
  }

  handleSocialLogin() { this.router.navigate(['/']); }
}
