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

  async getChildren() {
    return new Promise((resolve, reject) => {
      connection.query(null, null, (err, res) => {});
    });
  }
};
