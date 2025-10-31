import db from "../common/db.js";
const nha_cung_cap = (nha_cung_cap) => {
this.mancc = nha_cung_cap.mancc;
this.tenncc = nha_cung_cap.tenncc;
this.sdt = nha_cung_cap.sdt;
this.email = nha_cung_cap.email;
this.diachi = nha_cung_cap.diachi;
};
nha_cung_cap.getById = (id, callback) => {
  const sqlString = "SELECT * FROM nha_cung_cap WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

nha_cung_cap.getAll = (callback) => {
  const sqlString = "SELECT * FROM nha_cung_cap";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

nha_cung_cap.insert = (nha_cung_cap, callback) => {
  const sqlString = "INSERT INTO nha_cung_cap SET ?";
  db.query(sqlString, nha_cung_cap, (err, res) => {
    if (err) return callback(err);
    callback({ id: res.insertId, ... {tableName} });
  });
};

nha_cung_cap.update = (nha_cung_cap, id, callback) => {
  const sqlString = "UPDATE nha_cung_cap SET ? WHERE id = ?";
  db.query(sqlString, [nha_cung_cap, id], (err, res) => {
    if (err) return callback(err);
    callback("Cập nhật thành công");
  });
};

nha_cung_cap.delete = (id, callback) => {
  db.query("DELETE FROM nha_cung_cap WHERE id = ?", id, (err, res) => {
    if (err) return callback(err);
    callback("Xóa thành công");
  });
};

export default nha_cung_cap;
