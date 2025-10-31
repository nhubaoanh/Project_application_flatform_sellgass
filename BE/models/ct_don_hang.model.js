import db from "../common/db.js";
const ct_don_hang = (ct_don_hang) => {
this.mactdh = ct_don_hang.mactdh;
this.madh = ct_don_hang.madh;
this.masp = ct_don_hang.masp;
this.soluong = ct_don_hang.soluong;
this.dongia = ct_don_hang.dongia;
};
ct_don_hang.getById = (id, callback) => {
  const sqlString = "SELECT * FROM ct_don_hang WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

ct_don_hang.getAll = (callback) => {
  const sqlString = "SELECT * FROM ct_don_hang";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

ct_don_hang.insert = (ct_don_hang, callback) => {
  const sqlString = "INSERT INTO ct_don_hang SET ?";
  db.query(sqlString, ct_don_hang, (err, res) => {
    if (err) return callback(err);
    callback({ id: res.insertId, ... {tableName} });
  });
};

ct_don_hang.update = (ct_don_hang, id, callback) => {
  const sqlString = "UPDATE ct_don_hang SET ? WHERE id = ?";
  db.query(sqlString, [ct_don_hang, id], (err, res) => {
    if (err) return callback(err);
    callback("Cập nhật thành công");
  });
};

ct_don_hang.delete = (id, callback) => {
  db.query("DELETE FROM ct_don_hang WHERE id = ?", id, (err, res) => {
    if (err) return callback(err);
    callback("Xóa thành công");
  });
};

export default ct_don_hang;
