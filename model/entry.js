const connection = require("../connection");
const Folder = require("./folder");
const filter = require("../filter");

module.exports = class Entry {
  show = ["id", "text", "author_id", "folder_id", "title"];
  constructor(id, text, author_id, folder_id, title) {
    this.data = {
      id: id,
      text: text,
      author_id: author_id,
      folder_id: folder_id,
      title: title,
    };
  }

  getId() {
    return this.data.id;
  }

  getData() {
    return filter(this.data, this.show);
  }
  async getFolder() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT name, parent_folder_id, workspace_id FROM folder WHERE id=?",
        [this.data.folder_id],
        (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          if (res.length == 0) {
            reject("Folder not found");
            return;
          }
          let v = res[0];
          resolve(
            new Folder(
              this.data.folder_id,
              v.name,
              v.parent_folder_id,
              v.workspace_id
            )
          );
        }
      );
    });
  }

  static async get(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT id, text, author_id, folder_id,title FROM entry WHERE id=?",
        [id],
        (err, res) => {
          if (err) {
            reject(err);
            return;
          } else if (res.length == 0) {
            reject("Unknown entry");
            return;
          }
          res = res[0];
          resolve(
            new Entry(id, res.text, res.author_id, res.folder_id, res.title)
          );
        }
      );
    });
  }
};
