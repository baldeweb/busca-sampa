/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "bs-bg": "#2f3035",
                "bs-bg-header": "#1f2024",
                "bs-red": "#b33b32",
                "bs-card": "#3a3b40",
                "bs-card-light": "#f5f5f5",
            },
            fontFamily: {
                montserrat: ["Montserrat", "system-ui", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "sans-serif"],
                gothic: ["Science Gothic", "Montserrat", "system-ui", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "sans-serif"],
            },
            borderRadius: {
                app: "12px",
            },
        },
    },
    plugins: [],
};
