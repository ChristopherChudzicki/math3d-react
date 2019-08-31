export function attachDb(db) {
  return (req, res, next) => {
    if (req.db === undefined) {
      req.db = db
    }
    next()
  }
}
