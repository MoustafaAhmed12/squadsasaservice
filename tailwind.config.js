/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    fontFamily: {
      openSans: ["Open Sans", "serif"],
    },
    extend: {
      boxShadow: {
        "text-shadow-hover": "3px 3px 8px rgba(255, 0, 144, 0.7)",
      },
      colors: {
        mainWhite: "#F7F8F3",
        fGradient: "#ff0090",
        sGradient: "#d800f0",
        tGradient: "#75BBFD",
        // PSovle Colors
        // mainColor1: "#002C3D",
        // mainColor2: "#F8444F",
        // mainColor3: "#78BDC4",
        // subColor1: "#285C6A",
        // subColor2: "#508D97",
        // subColor3: "#F88086",
        // subColor4: "#F7BCBC",
      },
    },
  },
  plugins: [],
};
