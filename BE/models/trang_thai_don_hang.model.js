import db from "../common/db.js";
const trang_thai_don_hang = (trang_thai_don_hang) => {
this.matrangthai = trang_thai_don_hang.matrangthai;
this.tentrangthai = trang_thai_don_hang.tentrangthai;
};
trang_thai_don_hang.getById = (id, callback) => {
  const sqlString = "SELECT * FROM trang_thai_don_hang WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

trang_thai_don_hang.getAll = (callback) => {
  const sqlString = "SELECT * FROM trang_thai_don_hang";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

trang_thai_don_hang.insert = (trang_thai_don_hang, callback) => {
  const sqlString = "INSERT INTO trang_thai_don_hang SET ?";
  db.query(sqlString, trang_thai_don_hang, (err, res) => {
    if (err) return callback(err);
    callback({ id: res.insertId, ... {tableName} });
  });
};

trang_thai_don_hang.update = (trang_thai_don_hang, id, callback) => {
  const sqlString = "UPDATE trang_thai_don_hang SET ? WHERE id = ?";
  db.query(sqlString, [trang_thai_don_hang, id], (err, res) => {
    if (err) return callback(err);
    callback("Cập nhật thành công");
  });
};

trang_thai_don_hang.delete = (id, callback) => {
  db.query("DELETE FROM trang_thai_don_hang WHERE id = ?", id, (err, res) => {
    if (err) return callback(err);
    callback("Xóa thành công");
  });
};

export default trang_thai_don_hang;
