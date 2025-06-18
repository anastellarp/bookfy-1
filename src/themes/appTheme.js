import { MD3LightTheme as PaperLightTheme, MD3DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { colors } from './colors';

export const appThemeLight = {
  ...PaperLightTheme,
  colors: {
    ...PaperLightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.backgroundLight,
    surface: colors.surfaceLight,
    text: colors.textLight,
    error: colors.error,
  },
};

export const appThemeDark = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.backgroundDark,
    surface: colors.surfaceDark,
    text: colors.textDark,
    error: colors.error,
  },
};
