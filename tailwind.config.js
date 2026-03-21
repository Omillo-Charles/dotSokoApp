/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        ubuntu: ["Ubuntu-Regular"],
        "ubuntu-light": ["Ubuntu-Light"],
        "ubuntu-medium": ["Ubuntu-Medium"],
        "ubuntu-bold": ["Ubuntu-Bold"],
        sans: ["Ubuntu-Regular"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        brand: {
          light: "var(--brand-light)",
          "soft-blue": "var(--brand-soft-blue)",
          "soft-indigo": "var(--brand-soft-indigo)",
          deep: "var(--brand-deep)",
        },
      },
    },
  },
  plugins: [],
}