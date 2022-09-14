/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        animate: {
          "0%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "line-animation": "animate 5s linear infinite",
      },
    },
  },
  plugins: [require("tailwind-animation-delay")],
};
