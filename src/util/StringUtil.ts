const MINUTE = 60
const HOUR = 60 * 60
const DAY = 60 * 60 * 24

export const TEMPERATURE_PATTERN = /^\d{0,2}$/

export const toSnakeCase = (s: string): string =>
  s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export const toCamelCase = (s: string): string =>
  s
    .toLowerCase()
    .replace(/_([a-z])/g, (m) => m.toUpperCase())
    .replace(/_/g, '')

export const capitalize = (s: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

export const timePeriodToStr = (timePeriod: number): string => {
  let diff = timePeriod
  const days = Math.floor(diff / DAY)
  diff = diff % DAY
  const hours = Math.floor(diff / HOUR)
  diff = diff % HOUR
  const mins = Math.floor(diff / MINUTE)
  diff = diff % MINUTE
  if (days !== 0) {
    return `${days} days ${hours} hours ${mins} minutes ${diff} seconds`
  } else if (hours !== 0) {
    return `${hours} hours ${mins} minutes ${diff} seconds`
  } else if (mins !== 0) {
    return `${mins} minutes ${diff} seconds`
  } else {
    return `${diff} seconds`
  }
}

export const timestampToPeriod = (timestamp: number): string => {
  const now = new Date().getTime()
  return timePeriodToStr(Math.floor(now / 1000) - timestamp)
}

export const isNumberKey = (evt: any) => {
  const charCode = evt.which ? evt.which : evt.keyCode
  if (
    charCode != 190 &&
    charCode != 37 &&
    charCode != 39 &&
    charCode != 8 &&
    (charCode < 48 || charCode > 57)
  ) {
    evt.preventDefault()
  }
}

export const getTimeWithPadding = (time: number): string => {
  return time < 10 ? '0' + time : '' + time
}
