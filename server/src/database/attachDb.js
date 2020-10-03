export const attachDb = db => (req, res, next) => {
  req.db = db;
  next();
}