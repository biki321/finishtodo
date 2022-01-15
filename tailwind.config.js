module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'pageHeight': 'calc(-3rem + 100vh)',
      }
    }
  },
  plugins: [],
}
