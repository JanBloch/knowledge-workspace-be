const connection = require("../connection");
const Folder = require("../model/folder");

module.exports = function checkFolderReadPermission(req, res, next) {
  let uid = req.user.getId();
  Folder.get(req.params.id).then((folder) =>
    connection.query(
      "SELECT COUNT(*) as count FROM organization WHERE id IN (SELECT organization_id FROM workspace WHERE id=?)",
      [uid, folder.getWorkspaceId()],
      (err, result) => {
        if (err) res.status(401).json({ error: "Permission denied" });
        else if (result[0].count) next();
        else res.status(401).json({ error: "Permission denied" });
      }
    )
  );
};
