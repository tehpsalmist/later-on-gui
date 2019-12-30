import cronstrue from 'cronstrue'

export const cronDescriptionOrFormattedDate = str => {
  const values = {
    cron: true,
    date: false
  }

  try {
    values.formatted = cronstrue.toString(str, { use24HourTimeFormat: true })
  } catch (e) {
    values.cron = false
    values.date = true

    values.formatted = new Date(str).toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return values
}

export const extractCronStringOrErrorMessage = str => {
  try {
    return {
      valid: true,
      value: cronstrue.toString(str, { use24HourTimeFormat: true, verbose: true })
    }
  } catch (errorMessage) {
    return {
      valid: false,
      value: errorMessage
    }
  }
}
