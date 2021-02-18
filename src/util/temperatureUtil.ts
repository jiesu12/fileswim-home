export const toFahrenheit = (celsius: number): number => {
  return (celsius * 9) / 5 + 32
}

export const toCelsius = (fahrenheit: number): number => {
  return ((fahrenheit - 32) * 5) / 9
}

export const renderHumidity = (h: number): string => {
  return `${h.toFixed(1)}%`
}

export const renderTemperature = (degree: number, celsius: boolean): string => {
  if (degree === null) {
    return ''
  }
  return celsius ? `${degree.toFixed(0)}\u00B0C` : `${toFahrenheit(degree).toFixed(0)}\u00B0F`
}
