import type {Config} from "tailwindcss";
import {fontFamily} from "tailwindcss/defaultTheme";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)", ...fontFamily.sans],
            },
            colors: {
                brand: {
                    dark: "#243B42",
                    DEFAULT: "#2D4A53",
                    medium: "#3A5F6A",
                    light: "#C5DEE6",
                    lighter: "#E1EFF4",
                    lightest: "#F0F7FA",
                    offwhite: "#FAFAFA",
                    black: "#0D0D0D",
                },
            },
            borderRadius: {
                '4xl': '2rem',
            },
        },
    },
    plugins: [],
};

export default config;
