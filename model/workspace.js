const filter = require("../filter");
const connection = require("../connection");

module.exports = class Workspace {
  show = ["id", "name", "organization_id"];
  constructor(id, name, organization_id) {
    this.data = {
      id: id,
      name: name,
      organization_id: organization_id,
    };
  }

  getData() {
    return filter(this.data, this.show);
  }

  static async get(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT name, organization_id FROM workspace WHERE id=?",
        [id],
        (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          if (res.length == 0) {
            reject("Workspace not found");
            return;
          }
          resolve(new Workspace(id, res[0].name, res[0].organization_id));
        }
      );
    });
  }
};
