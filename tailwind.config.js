module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        text: "#BDC1C6",
        input: "#9CA3AF",
        option: "#E8EAED",
        lightblue: "#94B6F2",
        lightgrey: "#303134",
        darkgrey: "#202124"
      },
      backgroundColor: {
        lightgrey: "#303134",
        darkgrey: "#202124"
      }
    }
  },
  variants: {
    extend: {
      padding: ['hover', 'focus']
    },
  },
  plugins: [],
}
