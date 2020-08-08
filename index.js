const user = require("./user/user");
const mysql = require("mysql");
const express = require("express");
const filter = require("./filter");

//middlewares
const auth = require("./middleware/auth");
const checkPageReadPermission = require("./middleware/check-page-read-permission");
const cors = require("./middleware/cors");

const con = require("./connection");

//models
const Organization = require("./model/organization");
const Entry = require("./model/entry");
const { User } = require("./user/user");

const connection = require("./connection");

const app = express();

app.use(express.json());
app.use(cors);
app.use("/api", auth);
app.use("/api/page/:id", checkPageReadPermission);

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

  app.get("/api/page/:id", (req, res) => {
    Entry.get(req.params.id).then((v) => {
      res.json(v.getData());
    });
  });
  app.get("/api/page/:id/folder", (req, res) => {
    Entry.get(req.params.id).then((v) => {
      v.getFolder().then((folder) => {
        res.json(folder.getData());
      });
    });
  });
  app.get("/api/page/:id/folder/workspace", (req, res) => {
    Entry.get(req.params.id).then((v) => {
      v.getFolder().then((folder) => {
        folder.getWorkspace().then((workspace) => {
          res.json(workspace.getData());
        });
      });
    });
  });
  app.listen(8000, () => {
    console.log("Server listening at http://localhost:8000");
  });
}
