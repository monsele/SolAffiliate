/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': 'rgb(245 243 255)',
  				'100': 'rgb(237 233 254)',
  				'200': 'rgb(221 214 254)',
  				'300': 'rgb(196 181 253)',
  				'400': 'rgb(167 139 250)',
  				'500': 'rgb(139 92 246)',
  				'600': 'rgb(124 58 237)',
  				'700': 'rgb(109 40 217)',
  				'800': 'rgb(91 33 182)',
  				'900': 'rgb(76 29 149)',
  				'950': 'rgb(46 16 101)',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'50': 'rgb(240 249 255)',
  				'100': 'rgb(224 242 254)',
  				'200': 'rgb(186 230 253)',
  				'300': 'rgb(125 211 252)',
  				'400': 'rgb(56 189 248)',
  				'500': 'rgb(14 165 233)',
  				'600': 'rgb(2 132 199)',
  				'700': 'rgb(3 105 161)',
  				'800': 'rgb(7 89 133)',
  				'900': 'rgb(12 74 110)',
  				'950': 'rgb(8 47 73)',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				'50': 'rgb(255 247 237)',
  				'100': 'rgb(255 237 213)',
  				'200': 'rgb(254 215 170)',
  				'300': 'rgb(253 186 116)',
  				'400': 'rgb(251 146 60)',
  				'500': 'rgb(249 115 22)',
  				'600': 'rgb(234 88 12)',
  				'700': 'rgb(194 65 12)',
  				'800': 'rgb(154 52 18)',
  				'900': 'rgb(124 45 18)',
  				'950': 'rgb(67 20 7)',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		animation: {
  			'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			floating: 'floating 3s ease-in-out infinite'
  		},
  		keyframes: {
  			floating: {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
  			}
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};