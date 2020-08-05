const user = require("./user/user");
const mysql = require("mysql");
const express = require("express");
const filter = require("./filter");
const auth = require("./middleware/auth");
const con = require("./connection");
const Organization = require("./model/organization");
const { User } = require("./user/user");
const cors = require("./middleware/cors");

const app = express();
app.use(express.json());
app.use(cors);
app.use("/api", auth);

con.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
  init();
});

function getModelListData(modelList) {
  return modelList.map((v) => v.getData());
}
function init() {
  app.post("/auth/login", (req, res) => {
    let body = filter(req.body, ["email", "password"]);
    user
      .login(body.email, body.password, con)
      .then((v) => {
        res.json({ token: v });
      })
      .catch((v) => {
        res.status(401).json({ error: v });
      });
  });
  app.post("/auth/register", (req, res) => {
    let body = filter(req.body, ["username", "full_name", "email", "password"]);
    user
      .register(body.username, body.password, body.full_name, body.email, con)
      .then((id) => {
        res.json({ id: id });
      });
  });

  app.get("/api/authenticated/organization", (req, res) => {
    Organization.getByUserId(req.user.getId()).then((v) =>
      res.json(getModelListData(v))
    );
  });
  app.get("/api/authenticated", (req, res) => {
    res.json(req.user.getData());
  });
  app.put("/api/authenticated", (req, res) => {
    req.user.setData(req.body).then(() => {
      res.json({ message: "success" });
    });
  });
  app.listen(3000, () => {
    console.log("Server listening at http://localhost:3000");
  });
}
