import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'border-gray-800',
    'border-gray-700',
    'border-gray-600',
    'border-gray-500',
    'bg-gray-800',
    'bg-gray-700',
    'bg-gray-600',
    'bg-gray-500',
    'text-gray-800',
    'text-gray-700',
    'text-gray-600',
    'text-gray-500',
    'border-foreground',
    'text-foreground',
    'bg-foreground',
  ],
  theme: {
    extend: {
      screens: {
        // Breakpoints intermediários para melhor responsividade
        'xs': '475px',    // Extra small devices (phones pequenos)
        'sm': '640px',    // Small devices (phones)
        'md': '768px',    // Medium devices (tablets)
        'lg': '1024px',   // Large devices (laptops)
        'xl': '1280px',   // Extra large devices (desktops)
        '2xl': '1536px',  // 2X large devices (large desktops)
        
        // Breakpoints intermediários customizados
        'sm-md': '720px', // Entre small e medium
        'md-lg': '896px', // Entre medium e large
        'lg-xl': '1152px', // Entre large e extra large
        'xl-2xl': '1408px', // Entre extra large e 2x large
        
        // Breakpoints específicos para tablets
        'tablet-sm': '600px',  // Tablets pequenos (iPad mini)
        'tablet-md': '768px',  // Tablets médios (iPad padrão)
        'tablet-lg': '1024px', // Tablets grandes (iPad Pro)
        'tablet-xl': '1200px', // Tablets extra grandes
        
        // Breakpoints específicos para componentes
        'nav': '900px',   // Para navegação desktop/mobile
        'hero': '768px',  // Para seção hero responsiva
        'cards': '1024px', // Para grid de cards
        'sidebar': '1200px', // Para sidebar em admin
        
        // Breakpoints para layouts de grid otimizados
        'grid-sm': '640px',   // Grid 1 coluna -> 2 colunas
        'grid-md': '768px',   // Grid 2 colunas -> 3 colunas
        'grid-lg': '1024px',  // Grid 3 colunas -> 4 colunas
        'grid-xl': '1280px',  // Grid 4 colunas -> 5 colunas
      },
      colors: {
        // Church Brand Colors - Modern Palette
        church: {
          primary: "hsl(var(--church-primary))",
          "primary-light": "hsl(var(--church-primary-light))",
          accent: "hsl(var(--church-accent))",
          "accent-light": "hsl(var(--church-accent-light))",
          white: "hsl(var(--church-white))",
          dark: "hsl(var(--church-dark))",
          // Modern colors from technical report
          blue: "hsl(var(--church-blue))",
          "blue-light": "hsl(var(--church-blue-light))",
          gray: "hsl(var(--church-gray))",
          beige: "hsl(var(--church-beige))",
          "gradient-start": "hsl(var(--church-gradient-start))",
          "gradient-end": "hsl(var(--church-gradient-end))",
        },
        // Ensure standard Tailwind colors are available
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // System Colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Church-specific color utilities
        "church-gray": "hsl(var(--church-gray))",
        "church-blue": "hsl(var(--church-blue))",
        "church-accent": "hsl(var(--church-accent))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // 2025 Simplified Typography - Only 2 families as recommended
        sans: ["var(--font-inter)", "system-ui", "sans-serif"], // Primary body font
        serif: ["var(--font-playfair)", "serif"], // Display font for headings
        // Simplified - only Inter and Playfair Display
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
      },
      fontSize: {
        'church-title': ['2.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'church-subtitle': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'church-body': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
} satisfies Config;
