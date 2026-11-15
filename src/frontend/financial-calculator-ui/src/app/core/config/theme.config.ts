import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { PRIMARY_PALETTE, SURFACE_PALETTE } from '@core/constants/theme.constant';
import { paletteTokens, surfaceTokens } from '@core/functions/theme.function';

export const APP_THEME_PRESET = definePreset(Aura, {
  semantic: {
    primary: paletteTokens(PRIMARY_PALETTE),
    colorScheme: {
      light: { surface: surfaceTokens(SURFACE_PALETTE) },
      dark: { surface: surfaceTokens(SURFACE_PALETTE) }
    }
  }
});
