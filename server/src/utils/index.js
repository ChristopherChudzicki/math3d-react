/**
 * Automatically catch asynchronous errors for express
 * @param {Function} fn an asynchronous express route handler
 */
export function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next)
  }
}
