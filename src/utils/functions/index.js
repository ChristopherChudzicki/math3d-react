/**
 * Creates a Promise that is resolved after delay.
 * Good for using with async/await
 *
 * @param  {number} delay in milliseconds
 */
export function timeout(delay) {
  return new Promise(resolve => setTimeout(resolve, delay))
}
