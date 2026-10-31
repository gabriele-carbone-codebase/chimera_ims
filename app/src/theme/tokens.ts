// Ported from design-system/tokens (colors.css, themes.css, spacing.css, typography.css).
export type Palette = {
  page: string; card: string; sunken: string; hover: string; selected: string;
  borderSubtle: string; border: string; borderStrong: string; focus: string;
  text: string; textSecondary: string; textTertiary: string; textDisabled: string; textInverse: string; textAccent: string;
  action: string; actionHover: string; onAction: string;
  accent: string; accentSoft: string; accentSoftBorder: string; onAccent: string;
  success: string; successSoft: string; warning: string; warningSoft: string; danger: string; dangerSoft: string; info: string; infoSoft: string;
  scrim: string;
};

export const light: Palette = {
  page: '#FAFAFA', card: '#FFFFFF', sunken: '#F4F4F4', hover: '#F4F4F4', selected: '#FBF6E6',
  borderSubtle: '#E8E8E8', border: '#D6D6D6', borderStrong: '#B5B5B5', focus: '#A07C1A',
  text: '#0A0A0A', textSecondary: '#3A3A3A', textTertiary: '#6E6E6E', textDisabled: '#A0A0A0', textInverse: '#FAFAFA', textAccent: '#856414',
  action: '#0A0A0A', actionHover: '#3A3A3A', onAction: '#FFFFFF',
  accent: '#A07C1A', accentSoft: '#FBF6E6', accentSoftBorder: '#F4E8C0', onAccent: '#0A0A0A',
  success: '#3F6B4E', successSoft: '#EEF3EE', warning: '#8A5A14', warningSoft: '#FBF2E1', danger: '#A33B2B', dangerSoft: '#F8ECE8', info: '#3D5A80', infoSoft: '#ECF0F5',
  scrim: 'rgba(10,10,10,0.36)',
};

export const dark: Palette = {
  page: '#0A0A0A', card: '#141414', sunken: '#050505', hover: '#1F1F1F', selected: '#231C0A',
  borderSubtle: '#222222', border: '#2E2E2E', borderStrong: '#444444', focus: '#D4B454',
  text: '#F5F5F5', textSecondary: '#C8C8C8', textTertiary: '#8E8E8E', textDisabled: '#5E5E5E', textInverse: '#0A0A0A', textAccent: '#E0C36E',
  action: '#FFFFFF', actionHover: '#E0E0E0', onAction: '#0A0A0A',
  accent: '#D4B454', accentSoft: '#231C0A', accentSoftBorder: '#3D3213', onAccent: '#0A0A0A',
  success: '#7FA98A', successSoft: '#1C2820', warning: '#D9A452', warningSoft: '#2D2314', danger: '#D27565', dangerSoft: '#2E1A16', info: '#86A2C6', infoSoft: '#1A222D',
  scrim: 'rgba(0,0,0,0.6)',
};

export const space = { 1: 2, 2: 4, 3: 8, 4: 12, 5: 16, 6: 20, 7: 24, 8: 32, 9: 40, 10: 56 } as const;
export const radius = { sm: 4, md: 6, lg: 10, pill: 999 } as const;

export const fonts = {
  heading: 'Newsreader_500Medium',
  body: 'InstrumentSans_400Regular',
  bodyMedium: 'InstrumentSans_500Medium',
  mono: 'IBMPlexMono_400Regular',
} as const;

export const fontSize = { sm: 13, body: 14, md: 16, h3: 20, h2: 24, h1: 32, display: 44 } as const;
