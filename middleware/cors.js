module.exports = (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");
  res.set("Access-Control-Allow-Headers", "*");
  next();
};
