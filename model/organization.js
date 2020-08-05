const filter = require("../filter");
const connection = require("../connection");

module.exports = class Organization {
  show = ["name"];
  constructor(name, id) {
    this.data = {
      name: name,
      id: id,
    };
  }
  getData() {
    return filter(this.data, this.show);
  }
  getId() {
    return this.data.id;
  }

  static async getByUserId(userId) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT id, name FROM organization WHERE id IN (SELECT organization_id FROM organization_user WHERE user_id=?)",
        [userId],
        (err, res) => {
          if (err) reject(err);
          resolve(res.map((v) => new Organization(v.name, v.id)));
        }
      );
    });
  }
};
