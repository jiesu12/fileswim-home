export const toSnakeCase = (s: string): string =>
  s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export const toCamelCase = (s: string): string =>
  s
    .toLowerCase()
    .replace(/_([a-z])/g, (m) => m.toUpperCase())
    .replace(/_/g, '')
