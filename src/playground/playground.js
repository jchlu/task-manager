const fahrenheitToCelsius = (temp) => {
  return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
  return (temp * 1.8) + 32
}

const add = (x, y) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (x < 0 || y < 0) {
        return reject(new Error('Both values must be positive'))
      }
      resolve(x + y)
    }, 1000)
  })
}


//
// Goal: Test temperature conversion functions
//
// 1. Export both functions and load them into test suite
// 2. Create "Should convert 32 F to 0 C"
// 3. Create "Should convert 0 C to 32 F"
// 4. Run the Jest to test your work!

module.exports = {
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  add
}
