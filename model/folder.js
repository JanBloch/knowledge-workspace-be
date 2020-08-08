const connection = require("../connection");

module.exports = class Folder {
  constructor(id, name, parentFolderId, workspace_id) {
    this.data = {
      id: id,
      name: name,
      parentFolderId: parentFolderId,
      workspace_id: workspace_id,
    };
  }

  getId() {
    return this.data.id;
  }

  getWorkspaceId() {
    return this.data.workspace_id;
  }
  async getChildren() {
    return new Promise((resolve, reject) => {
      connection.query(null, null, (err, res) => {});
    });
  }
};
