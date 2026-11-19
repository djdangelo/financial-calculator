import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { ColorScheme } from '@core/@types/color-scheme.type';
import { ThemeMode } from '@core/@types/theme-mode.type';
import { DARK_CLASS, DARK_MEDIA_QUERY, THEME_STORAGE_KEY } from '@core/constants/theme.constant';
import { writeLocalStorage } from '@core/functions/local-storage.function';
import { readStoredThemeMode } from '@core/functions/theme.function';
import { PrintService } from '@core/services/print.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly darkQuery = window.matchMedia(DARK_MEDIA_QUERY);
  private readonly systemPrefersDark = signal(this.darkQuery.matches);
  private readonly print = inject(PrintService);

  readonly mode = signal<ThemeMode>(readStoredThemeMode());

  readonly colorScheme = computed<ColorScheme>(() => {
    if (this.print.isPrinting()) {
      return 'light';
    }
    const mode = this.mode();
    if (mode === 'system') {
      return this.systemPrefersDark() ? 'dark' : 'light';
    }
    return mode;
  });

  constructor() {
    const onSystemChange = (event: MediaQueryListEvent) => this.systemPrefersDark.set(event.matches);
    this.darkQuery.addEventListener('change', onSystemChange);
    inject(DestroyRef).onDestroy(() => this.darkQuery.removeEventListener('change', onSystemChange));

    this.applyColorScheme(this.colorScheme());
    effect(() => this.applyColorScheme(this.colorScheme()));
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    writeLocalStorage(THEME_STORAGE_KEY, mode);
  }

  toggle(): void {
    this.setMode(this.colorScheme() === 'dark' ? 'light' : 'dark');
  }

  private applyColorScheme(colorScheme: ColorScheme): void {
    document.documentElement.classList.toggle(DARK_CLASS, colorScheme === 'dark');
  }
}
