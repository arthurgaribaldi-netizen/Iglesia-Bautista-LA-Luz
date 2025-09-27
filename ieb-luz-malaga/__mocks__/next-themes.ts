// Mock para next-themes
export const useTheme = () => ({
  theme: 'light',
  setTheme: jest.fn(),
  systemTheme: 'light',
  themes: ['light', 'dark'],
  resolvedTheme: 'light',
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => children;

export default {
  useTheme,
  ThemeProvider,
};
