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
        // Main
        mainGreen: "#46B985",
        secondaryGreen: "#87dcc0",
        tertiartGreen: "#1a936f",
        mainWhite: "#EEEEEE",
        mainBlack: "#000001",
        secondaryBlack: "#ACACAC",
        fGradient: "#ff0090",
        sGradient: "#d800f0",
        tGradient: "#75bbfd",

        // Admin
        mainColor1: "#222831",
        mainColor2: "#31363F",
        mainColor3: "#76ABAE",
        mainColor4: "#EEEEEE",
      },
    },
  },
  plugins: [],
};
