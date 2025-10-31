import db from "../common/db.js";
const hang_tv = (hang_tv) => {
this.mahang = hang_tv.mahang;
this.tenhang = hang_tv.tenhang;
};
hang_tv.getById = (id, callback) => {
  const sqlString = "SELECT * FROM hang_tv WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

hang_tv.getAll = (callback) => {
  const sqlString = "SELECT * FROM hang_tv";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

hang_tv.insert = (hang_tv, callback) => {
  const sqlString = "INSERT INTO hang_tv SET ?";
  db.query(sqlString, hang_tv, (err, res) => {
    if (err) return callback(err);
    callback({ id: res.insertId, ... {tableName} });
  });
};

hang_tv.update = (hang_tv, id, callback) => {
  const sqlString = "UPDATE hang_tv SET ? WHERE id = ?";
  db.query(sqlString, [hang_tv, id], (err, res) => {
    if (err) return callback(err);
    callback("Cập nhật thành công");
  });
};

hang_tv.delete = (id, callback) => {
  db.query("DELETE FROM hang_tv WHERE id = ?", id, (err, res) => {
    if (err) return callback(err);
    callback("Xóa thành công");
  });
};

export default hang_tv;
