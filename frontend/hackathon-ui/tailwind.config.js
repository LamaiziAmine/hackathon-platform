/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'plathon-blue': '#2563eb',
                'plathon-dark': '#00122e', 
            },
        },
    },
    plugins: [],
}