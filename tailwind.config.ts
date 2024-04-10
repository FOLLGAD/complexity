import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-headings": "hsl(var(--primary))",
            h1: {
              fontWeight: 300,
            },
            h2: {
              fontWeight: 300,
            },
            h3: {
              fontWeight: 300,
            },
            h4: {
              fontWeight: 300,
            },
            color: "hsl(var(--primary))",
            strong: {
              color: "hsl(var(--primary))",
            },
            code: {
              color: "hsl(var(--primary))",
              backgroundColor: "hsl(var(--transparent))",
            },
          },
        },
      },
      colors: {
        black: "#000212",
        gray: {
          100: "rgba(255, 255, 255, 0.08)", // transparent white
          200: "#f7f8f8", // off white
          300: "#b4bcd0", // primary text
          400: "#858699", // gray
          500: "#222326", // gray dark
        },
        transparent: "transparent",
        white: "#fff",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        pendulum: {
          "0%, 100%": {
            transform: "rotate(0deg)",
            animationTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          },
          "25%": {
            transform: "rotate(15deg)",
            animationTimingFunction: "cubic-bezier(0.46, 0.03, 0.52, 0.96)",
          },
          "75%": {
            transform: "rotate(-15deg)",
            animationTimingFunction: "cubic-bezier(0.55, 0.09, 0.68, 0.53)",
          },
        },
        fadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "pendulum-bounce": {
          "0%, 100%": {
            transform: "rotate(0deg)",
            animationTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          },
          "25%": {
            transform: "rotate(8deg)",
            animationTimingFunction: "cubic-bezier(0.46, 0.03, 0.52, 0.96)",
          },
          "75%": {
            transform: "rotate(-4deg)",
            animationTimingFunction: "cubic-bezier(0.55, 0.09, 0.68, 0.53)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        pendulum: "pendulum 1s infinite",
        fade: "fadeOut 5s ease-in-out",
        "pendulum-bounce": "pendulum-bounce 0.75s 1",
      },
      dropShadow: {
        glow: [
          "0 0px 20px rgba(255,255, 255, 0.25)",
          "0 0px 45px rgba(255, 255,255, 0.2)",
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
