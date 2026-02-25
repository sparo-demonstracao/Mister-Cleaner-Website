/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#FAF8F5',
                primary: '#1A1818',
                accent: '#E3C1B0',
                dark: '#0A0A0A'
            },
            fontFamily: {
                heading: ['"Plus Jakarta Sans"', 'sans-serif'],
                drama: ['"Cormorant Garamond"', 'serif'],
                data: ['"IBM Plex Mono"', 'monospace'],
                body: ['"Outfit"', 'sans-serif'],
            },
            screens: {
                'xs': '480px',
                // sm: '640px' (default)
                // md: '768px' (default)
                // lg: '1024px' (default)
                // xl: '1280px' (default)
                // 2xl: '1536px' (default)
            },
        },
    },
    plugins: [],
}
