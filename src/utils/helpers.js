export function escapeRegExp(string) {
  // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function replaceAll(str, find, replaceWith) {
  // from https://stackoverflow.com/a/1144788/2747370
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replaceWith)
}

export function findClosingBrace(string, startIdx) {
  const braces = {
    '[': ']',
    '<': '>',
    '(': ')',
    '{': '}'
  }
  const openingBrace = string[startIdx]
  const closingBrace = braces[openingBrace]

  if (closingBrace === undefined) {
    throw Error(`${string} does not contain an opening brace at position ${startIdx}.`)
  }

  let stack = 1

  // eslint-disable-next-line no-plusplus
  for (let j = startIdx + 1; j < string.length; j++) {
    if (string[j] === openingBrace) {
      stack += +1
    }
    else if (string[j] === closingBrace) {
      stack += -1
    }
    if (stack === 0) {
      return j
    }
  }

  // stack !== 0
  throw Error(`${string} has a brace that opens at position ${startIdx} but does not close.`)
}
