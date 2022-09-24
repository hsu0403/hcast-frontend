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
        lanimate: {
          "0%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(180deg)" },
        },
        appear: {
          "0%": { opacity: 0.1 },
          "100%": { opacity: 1 },
        },
        disappear: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0.1 },
        },
      },
      animation: {
        "line-animation": "animate 5s linear infinite",
        "lineheader-animation": "lanimate 5s linear infinite",
        "appear-animation": "appear .5s linear",
        "disappear-animation": "disappear .5s linear",
        "disappear-infinite-animation": "disappear .8s linear infinite",
      },
    },
  },
  plugins: [
    require("tailwind-animation-delay"),
    require("tailwindcss-writing-mode")({
      variants: ["responsive", "hover"],
    }),
  ],
};
