/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html,svelte}",
    "../shared/src/**/*.{js,jsx,ts,tsx,html,svelte}",
  ],
  theme: {
    extend: {
      boxShadow: {
        small: "0 4px 4px rgba(0, 0, 0, 0.06)",
      },
      colors: {
        grey: "#E4E4E4",
        green: "#0BB489",
        "dark-grey": "#5A5A5A",
        "dark-blue": "#050B20",
        "dark-green": "#328965",
        "light-green": "#58E1A5",
      },
    },
  },
  plugins: [],
};
