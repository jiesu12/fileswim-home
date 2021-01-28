const MINUTE = 60
const HOUR = 60 * 60
const DAY = 60 * 60 * 24

export const toSnakeCase = (s: string): string =>
  s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export const toCamelCase = (s: string): string =>
  s
    .toLowerCase()
    .replace(/_([a-z])/g, (m) => m.toUpperCase())
    .replace(/_/g, '')

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
