export function matchRegex (input: string, regex: RegExp): string {
  const matches = input.match(regex)
  if (matches === null) return ''

  return matches.length > 0 ? matches[1] : ''
}
