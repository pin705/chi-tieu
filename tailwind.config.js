module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--zmp-primary-color)",
        primaryForeground: "var(--primaryForeground)",
        foreground: "var(--foreground)",
        background: "var(--background)",
        section: "var(--section)",
        inactive: "var(--inactive)",
        subtitle: "var(--subtitle)",
        skeleton: "var(--skeleton)",
        gray: "#767A7F",
        divider: "#E9EBED",
        green: "#288F4E",
        indigo: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        yellow: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        }
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        'card': '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
        'floating': '0 8px 24px 0 rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
    },
  },
};
