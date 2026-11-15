module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter Variable', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [require('tailwindcss-primeui')],
}
