const connection = require("../connection");
const filter = require("../filter");
const Workspace = require("./workspace");

module.exports = class Folder {
  show = ["id", "name", "parent_folder_id", "workspace_id"];
  constructor(id, name, parent_folder_id, workspace_id) {
    this.data = {
      id: id,
      name: name,
      parent_folder_id: parent_folder_id,
      workspace_id: workspace_id,
    };
  }

  async getWorkspace() {
    return new Promise((resolve, reject) => {
      Workspace.get(this.data.workspace_id)
        .then((v) => {
          resolve(v);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getId() {
    return this.data.id;
  }

  getWorkspaceId() {
    return this.data.workspace_id;
  }

  getData() {
    return filter(this.data, this.show);
  }

  async getContent() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT id, name AS 'title', 'FOLDER' AS type FROM folder WHERE parent_folder_id = ? UNION SELECT id, title, 'ENTRY' AS type FROM entry WHERE folder_id = ?",
        [this.data.id, this.data.id],
        (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(res);
        }
      );
    });
  }
  async getChildren() {
    return new Promise((resolve, reject) => {
      connection.query(null, null, (err, res) => {});
    });
  }

  static async get(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT name, parent_folder_id, workspace_id FROM folder WHERE id=?",
        [id],
        (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          if (res.length == 0) {
            reject("Folder not found");
            return;
          }
          res = res[0];
          resolve(
            new Folder(id, res.name, res.parent_folder_id, res.workspace_id)
          );
        }
      );
    });
  }
};
