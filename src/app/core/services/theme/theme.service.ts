import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'lk-theme';
  
  theme = signal<'light' | 'dark'>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  private getInitialTheme(): 'light' | 'dark' {
    const stored = window.localStorage.getItem(this.THEME_KEY);
    return stored === 'dark' ? 'dark' : 'light';
  }

  toggleTheme() {
    this.theme.update(current => {
      const next = current === 'light' ? 'dark' : 'light';
      this.applyTheme(next);
      return next;
    });
  }

  private applyTheme(theme: 'light' | 'dark') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.localStorage.setItem(this.THEME_KEY, theme);
  }
}
