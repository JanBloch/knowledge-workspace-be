const bcrypt = require("bcrypt");
const filter = require("../filter");
const jwt = require("jsonwebtoken");
const connection = require("../connection");

class User {
  show = ["email", "username", "full_name"];
  fillable = ["email", "username", "full_name"];

  constructor(email, username, full_name, password, id) {
    this.data = {
      email: email,
      username: username,
      full_name: full_name,
      password: password,
      id: id,
    };
  }

  getData() {
    return filter(this.data, this.show);
  }

  getId() {
    return this.data.id;
  }

  getDataWithId() {
    return { ...filter(this.data, this.show), id: this.data.id };
  }
  getPassword() {
    return this.data.password;
  }

  async setData(data) {
    data = filter(data, this.fillable);
    let query = Object.keys(data)
      .map((v) => v + "=?")
      .join(",");
    Object.keys(data).forEach((v) => {
      this.data[v] = data[v];
    });
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET ${query} WHERE id=?`,
        [...Object.values(data), this.getId()],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }
  static async get(id, connection) {
    return new Promise((resolve) => {
      connection.query(
        "SELECT email, username, full_name, password FROM user WHERE id=?",
        [id],
        (err, result) => {
          if (err) throw err;
          if (result.length == 0) {
            reject("User not found");
            return;
          }
          let res = result[0];
          resolve(
            new User(res.email, res.username, res.full_name, res.password, id)
          );
        }
      );
    });
  }
  static async getByEmail(email, connection) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT id, username, full_name, password FROM user WHERE email=?",
        [email],
        (err, result) => {
          if (err) throw err;
          if (result.length == 0) {
            reject("User not found");
            return;
          }
          let res = result[0];
          resolve(
            new User(email, res.username, res.full_name, res.password, res.id)
          );
        }
      );
    });
  }
}

async function login(email, password, connection) {
  return new Promise((resolve, reject) => {
    User.getByEmail(email, connection)
      .then((v) => {
        bcrypt.compare(password, v.getPassword()).then((valid) => {
          if (valid) {
            let token = jwt.sign({ userId: v.getId() }, "ASDF", {
              expiresIn: "24h",
            });
            resolve(token);
          } else {
            reject("Invalid credentials");
          }
        });
      })
      .catch((v) => {
        reject("Invalid credentials");
      });
  });
}

async function register(username, password, full_name, email, connection) {
  return new Promise((resolve) => {
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) throw err;
      connection.query(
        "INSERT INTO user (username, password, full_name, email) VALUES (?, ?, ?, ?)",
        [username, hash, full_name, email],
        function (_err, res) {
          if (_err) throw _err;
          resolve(res.insertId);
        }
      );
    });
  });
}
module.exports = {
  login: login,
  register: register,
  User: User,
};
