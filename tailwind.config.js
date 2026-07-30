/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        deepPurple: "#4B0082",
        royalPurple: "#6A0DAD",
        vibrantOrange: "#FF7A00",
        brightGold: "#FFC107",
        ink: "#1A0B2E",
        mist: "#F6F4FB",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glowPurple: "0 0 40px -8px rgba(106, 13, 173, 0.55)",
        glowOrange: "0 0 40px -8px rgba(255, 122, 0, 0.55)",
        glowGold: "0 0 30px -6px rgba(255, 193, 7, 0.5)",
        card: "0 10px 30px -12px rgba(75, 0, 130, 0.25)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #4B0082 0%, #6A0DAD 45%, #FF7A00 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(75,0,130,0.9) 0%, rgba(106,13,173,0.9) 45%, rgba(255,122,0,0.85) 100%)",
        "gold-gradient": "linear-gradient(135deg, #FFC107 0%, #FF7A00 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-18px) rotate(4deg)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(30px,-30px) scale(1.1)" },
          "66%": { transform: "translate(-20px,20px) scale(0.95)" },
        },
        wheelSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        drive: {
          "0%": { transform: "translateX(-6px)" },
          "50%": { transform: "translateX(6px)" },
          "100%": { transform: "translateX(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.6" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        popIn: {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        floatSlow: "floatSlow 4s ease-in-out infinite",
        blob: "blob 9s ease-in-out infinite",
        wheelSpin: "wheelSpin 0.6s linear infinite",
        drive: "drive 1.4s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
        ripple: "ripple 0.6s ease-out forwards",
        popIn: "popIn 0.25s ease-out",
      },
      borderRadius: {
        xl2: "1.75rem",
      },
    },
  },
  plugins: [],
};
