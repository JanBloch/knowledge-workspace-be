const jwt = require("jsonwebtoken");
const { User } = require("../user/user");
const con = require("../connection");

module.exports = (req, res, next) => {
  try {
    console.log(req.headers);
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "ASDF");
    const userId = decodedToken.userId;
    if (isNaN(userId)) throw new Error("");
    User.get(userId, con).then((v) => {
      req.user = v;
      next();
    });
  } catch (e) {
    console.log(e);
    res.status(401).json({
      error: "Invalid Request",
    });
  }
};
