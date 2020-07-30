import cronstrue from 'cronstrue'

export const isCronSyntax = thing => {
  try {
    const parts = thing.split(' ').length

    return 5 <= parts && parts <= 6
  } catch (e) {
    return false
  }
}

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

// https://gist.github.com/dperini/729294
const urlRegex = new RegExp(
  '^' +
    // protocol identifier (optional)
    // short syntax // still required
    '(?:(?:(?:https?|ftp):)?\\/\\/)' +
    // user:pass BasicAuth (optional)
    '(?:\\S+(?::\\S*)?@)?' +
    '(?:' +
      // IP address exclusion
      // private & local networks
      '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
      '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
      '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broadcast addresses
      // (first & last IP address of each class)
      '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
      '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
      '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
    '|' +
      // host & domain names, may end with dot
      // can be replaced by a shortest alternative
      // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
      '(?:' +
        '(?:' +
          '[a-z0-9\\u00a1-\\uffff]' +
          '[a-z0-9\\u00a1-\\uffff_-]{0,62}' +
        ')?' +
        '[a-z0-9\\u00a1-\\uffff]\\.' +
      ')+' +
      // TLD identifier name, may end with dot
      '(?:[a-z\\u00a1-\\uffff]{2,}\\.?)' +
    ')' +
    // port number (optional)
    '(?::\\d{2,5})?' +
    // resource path (optional)
    '(?:[/?#]\\S*)?' +
  '$', 'i'
)

export const isValidUrl = url => !!url.match(urlRegex)
