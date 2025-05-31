// // tailwind.config.js
// module.exports = {
//     darkMode: 'class', // This enables class-based dark mode
//     content: [
//       './app/**/*.{js,ts,jsx,tsx}', // Path to your components
//       './pages/**/*.{js,ts,jsx,tsx}',
//       './components/**/*.{js,ts,jsx,tsx}',
//     ],
//     theme: {
//       extend: {
//         colors: {
//           // Your custom colors if needed
//         },
//       },
//     },
//     plugins: [
//       // Any Tailwind plugins you need
//     ],
//   };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}