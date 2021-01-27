export const toSnakeCase = (s: string): string =>
  s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export const toCamelCase = (s: string): string =>
  s
    .toLowerCase()
    .replace(/_([a-z])/g, (m) => m.toUpperCase())
    .replace(/_/g, '')

export const timestampToStr = (t: number): string => {
  return new Date(t * 1000).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })
}
