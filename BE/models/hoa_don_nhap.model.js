import db from "../common/db.js";
const hoa_don_nhap = (hoa_don_nhap) => {
this.mahdn = hoa_don_nhap.mahdn;
this.mancc = hoa_don_nhap.mancc;
this.manv = hoa_don_nhap.manv;
this.ngaynhap = hoa_don_nhap.ngaynhap;
this.tongtien = hoa_don_nhap.tongtien;
};
hoa_don_nhap.getById = (id, callback) => {
  const sqlString = "SELECT * FROM hoa_don_nhap WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

hoa_don_nhap.getAll = (callback) => {
  const sqlString = "SELECT * FROM hoa_don_nhap";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

hoa_don_nhap.insert = (hoa_don_nhap, callback) => {
  const sqlString = "INSERT INTO hoa_don_nhap SET ?";
  db.query(sqlString, hoa_don_nhap, (err, res) => {
    if (err) return callback(err);
    callback({ id: res.insertId, ... {tableName} });
  });
};

hoa_don_nhap.update = (hoa_don_nhap, id, callback) => {
  const sqlString = "UPDATE hoa_don_nhap SET ? WHERE id = ?";
  db.query(sqlString, [hoa_don_nhap, id], (err, res) => {
    if (err) return callback(err);
    callback("Cập nhật thành công");
  });
};

hoa_don_nhap.delete = (id, callback) => {
  db.query("DELETE FROM hoa_don_nhap WHERE id = ?", id, (err, res) => {
    if (err) return callback(err);
    callback("Xóa thành công");
  });
};

export default hoa_don_nhap;
