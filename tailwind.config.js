module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      option: "#E8EAED",
      lightblue: "#94B6F2",
      lightgrey: "303134"
    },
    backgroundColor: {
      lightgrey: "#303134",
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
