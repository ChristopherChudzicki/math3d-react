// @flow

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

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

export function findIntegralEnd(str: string, startIdx: number) {

  const openingIntegral = '\\int'
  const closingIntegral = 'd'

  if (str.slice(startIdx, startIdx + 4) !== openingIntegral) {
    throw Error(`${str} does not contain an opening of integral at position ${startIdx}.`)
  }
  const ownUpperBoundaryStart =  str.indexOf('^', startIdx) + 1
  const start = str[ownUpperBoundaryStart] === '{' ? findClosingBrace(str, ownUpperBoundaryStart) + 1 : ownUpperBoundaryStart + 1

  const strlen = str.length

  let stack = 1

  for (let j = start; j < strlen; j++) {
    /**
    * TODO: add exceptions to skip operator, default function (sin, cos, tan, ln, etc...)
    * so that they won't be detected as end of integral
    * */
    if (str.slice(j,j+4) === openingIntegral) {
      stack += 1
      const upperBoundaryStart = str.indexOf('^', j)
      const integrandStart = str[upperBoundaryStart] === '{' ? findClosingBrace(str, upperBoundaryStart) : upperBoundaryStart
      j = integrandStart
    }
    else if (str[j] === closingIntegral && j + 1 < strlen) {
      stack -= 1
      //edge case for integral ddd
      if (str.slice(j,j+3) === 'ddd') {
        j += 1
      }
      if (stack === 0) {
        return j
      }
      if (str[j+1] === '\\') {
        j = str.indexOf(' ', j)
      }
      else {
        j++
      }
    }  
  }
  //stack !== 0
  throw Error(`cannot find end of integral.`)
}
