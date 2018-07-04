import diff from 'jest-diff'
import getType from 'jest-get-type'

/**
 * Generates nSample random real numbers between min and max
 *
 * @param  {number} min      interval lower limit
 * @param  {number} max      interval upper limit
 * @param  {number} nSamples number of random samples
 * @return {Object[]}          random samples
 */
function randomReals(min, max, nSamples) {
  return Array.from( { length: nSamples } ).map(() => {
    return min + (max - min) * Math.random()
  } )
}

/**
 * generates nSamples random samples, each sample is an array of length
 * sampleLength
 *
 * @param  {number} min          sample comonent lower limit
 * @param  {number} max          sample comonent upper limit
 * @param  {number} nSamples     number of samples
 * @param  {number} sampleLength length of each sample
 * @return {Object[]}            array of samples
 */
function genSamples(min, max, nSamples, sampleLength) {
  return Array.from( { length: nSamples } ).map(() => {
    return randomReals(min, max, sampleLength)
  } )
}

/**
 * recursively checks whether a and b are nearly equal:
 *   - for numbers, approximate equality
 *   - for functions, approximate equal at random samples
 *   - for arrays/objects, approximate equality of all keys
 *   - fallback to strict equality === as default case
 *
 * @param  {any}  a           [description]
 * @param  {[type]}  b           [description]
 * @param  {Object}  [config={}] [description]
 * @return {Boolean}             [description]
 */
export function isNearlyEqual(a, b, config = {} ) {
  const {
    numDigits = 6,
    nSamples = 5,
    range = [1, 3]
  } = config

  if (getType(a) !== getType(b)) {
    return false
  }

  switch (getType(a)) {

    case 'number': {
      return Math.abs(a - b) <= 10 ** -numDigits
    }

    case 'array': {
      return a.length === b.length &&
        a.every((item, index) => isNearlyEqual(item, b[index], config))
    }

    case 'function': {
      // by using max arity, we allow that functions of different arity might be
      // nearly equal. For example, x => 5 and (x, y) => 5
      const arity = Math.max(a.length, b.length)
      const [min, max] = range
      const samples = genSamples(min, max, nSamples, arity)
      return isNearlyEqual(
        samples.map(sample => a(...sample)),
        samples.map(sample => b(...sample)),
        config)
    }

    case 'object': {
      if (Object.keys(a).length !== Object.keys(b).length) {
        return false
      }
      const sameKeys = Object.keys(a).sort().every((key, index) => (
        key === Object.keys(b).sort()[index]
      ))
      return sameKeys && Object.keys(a).every((key, index) => (
        isNearlyEqual(a[key], b[key], config)
      ))
    }

    default: {
      return a === b
    }

  }

}

export function toNearlyEqual(received, expected, config = {} ) {

  const pass = isNearlyEqual(received, expected, config)

  const jestMessage = (pass, received, expected) => {
    return pass
      ? () =>
        this.utils.matcherHint('.not.toNearlyEqual') +
          '\n\n' +
          `Expected value to not be:\n` +
          `  ${this.utils.printExpected(expected)}\n` +
          `Received:\n` +
          `  ${this.utils.printReceived(received)}`
      : () => {
        const diffString = '\t Approximate difference not implemented, Sorry!'
        return (
          this.utils.matcherHint('.toNearlyEqual') +
            '\n\n' +
            `Expected value to be:\n` +
            `  ${this.utils.printExpected(expected)}\n` +
            `Received:\n` +
            `  ${this.utils.printReceived(received)}` +
            (diffString ? `\n\nDifference:\n\n${diffString}` : '')
        )
      }
  }

  return {
    pass,
    message: jestMessage(pass, received, expected)
  }
}
