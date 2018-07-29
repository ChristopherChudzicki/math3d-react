// @flow
export function escapeRegExp(str: string) {
  // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
  // $& means the whole matched string
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function replaceAll(str: string, find: string, replaceWith: string) {
  // from https://stackoverflow.com/a/1144788/2747370
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replaceWith)
}

export function findClosingBrace(str: string, startIdx: number) {
  const braces = {
    '[': ']',
    '<': '>',
    '(': ')',
    '{': '}'
  }

  const openingBrace = str[startIdx]

  const closingBrace = braces[openingBrace]

  if (closingBrace === undefined) {
    throw Error(`${str} does not contain an opening brace at position ${startIdx}.`)
  }

  let stack = 1

  // eslint-disable-next-line no-plusplus
  for (let j = startIdx + 1; j < str.length; j++) {
    if (str[j] === openingBrace) {
      stack += +1
    }
    else if (str[j] === closingBrace) {
      stack += -1
    }
    if (stack === 0) {
      return j
    }
  }

  // stack !== 0
  throw Error(`${str} has a brace that opens at position ${startIdx} but does not close.`)
}
