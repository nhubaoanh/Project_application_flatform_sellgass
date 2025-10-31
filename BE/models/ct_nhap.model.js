import db from "../common/db.js";
const ct_nhap = (ct_nhap) => {
this.mactn = ct_nhap.mactn;
this.mahdn = ct_nhap.mahdn;
this.masp = ct_nhap.masp;
this.soluong = ct_nhap.soluong;
this.dongia = ct_nhap.dongia;
};
ct_nhap.getById = (id, callback) => {
  const sqlString = "SELECT * FROM ct_nhap WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

ct_nhap.getAll = (callback) => {
  const sqlString = "SELECT * FROM ct_nhap";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

ct_nhap.insert = (ct_nhap, callback) => {
  const sqlString = "INSERT INTO ct_nhap SET ?";
  db.query(sqlString, ct_nhap, (err, res) => {
    if (err) return callback(err);
    callback({ id: res.insertId, ... {tableName} });
  });
};

ct_nhap.update = (ct_nhap, id, callback) => {
  const sqlString = "UPDATE ct_nhap SET ? WHERE id = ?";
  db.query(sqlString, [ct_nhap, id], (err, res) => {
    if (err) return callback(err);
    callback("Cập nhật thành công");
  });
};

ct_nhap.delete = (id, callback) => {
  db.query("DELETE FROM ct_nhap WHERE id = ?", id, (err, res) => {
    if (err) return callback(err);
    callback("Xóa thành công");
  });
};

export default ct_nhap;
