/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#F2F0E9',
                primary: '#2E4036',
                accent: '#CC5833',
                dark: '#1A1A1A'
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
