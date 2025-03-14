/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			colors: {
				brand: "#356851",
				brandGreen: {
					50: "#f2f8f5",
					100: "#e6f1eb",
					200: "#c0dbcc",
					300: "#9bc5ad",
					400: "#71ad8b",
					500: "#356851", // Your main shade
					600: "#2f5f49",
					700: "#274f3d",
					800: "#203e31",
					900: "#172c24",
				},
				brandAccent: "#735168",
				back: "#161616",
			},
			screens: {
				xs: "475px",
			},
			keyframes: {
				glow: {
					"0%, 100%": {
						textShadow:
							"0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.6)",
					},
					"50%": {
						textShadow:
							"0 0 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 255, 255, 0.6)",
					},
				},
			},
			animation: {
				glow: "glow 2s infinite",
			},
		},
	},
	plugins: [],
};
