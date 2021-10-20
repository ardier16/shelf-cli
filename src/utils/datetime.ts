export function getDayStartDate (value: Date): Date {
  const date = new Date(value)

  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)

  return date
}

export function formatTimePeriod (seconds: number) : string {
  const SECONDS_IN_MINUTE = 60
  const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60

  const totalHours = Math.floor(seconds / SECONDS_IN_HOUR)
  const leftSeconds = seconds - totalHours * SECONDS_IN_HOUR
  const totalMinutes = Math.floor(leftSeconds / SECONDS_IN_MINUTE)

  const formatParts : string[] = []
  if (totalHours > 0) {
    formatParts.push(`${totalHours}h`)
  }

  if (totalMinutes > 0) {
    formatParts.push(`${totalMinutes}m`)
  }

  return formatParts.length > 0 ? formatParts.join(' ') : '0h'
}
