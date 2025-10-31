import db from "../common/db.js";
const khuyen_mai = (khuyen_mai) => {
this.makm = khuyen_mai.makm;
this.tenkm = khuyen_mai.tenkm;
this.kieugiam = khuyen_mai.kieugiam;
this.giatri_giam = khuyen_mai.giatri_giam;
this.ngaybd = khuyen_mai.ngaybd;
this.ngaykt = khuyen_mai.ngaykt;
this.mota = khuyen_mai.mota;
};
khuyen_mai.getById = (id, callback) => {
  const sqlString = "SELECT * FROM khuyen_mai WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

khuyen_mai.getAll = (callback) => {
  const sqlString = "SELECT * FROM khuyen_mai";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

khuyen_mai.insert = (khuyen_mai, callback) => {
  const sqlString = "INSERT INTO khuyen_mai SET ?";
  db.query(sqlString, khuyen_mai, (err, res) => {
    if (err) return callback(err);
    callback({ id: res.insertId, ... {tableName} });
  });
};

khuyen_mai.update = (khuyen_mai, id, callback) => {
  const sqlString = "UPDATE khuyen_mai SET ? WHERE id = ?";
  db.query(sqlString, [khuyen_mai, id], (err, res) => {
    if (err) return callback(err);
    callback("Cập nhật thành công");
  });
};

khuyen_mai.delete = (id, callback) => {
  db.query("DELETE FROM khuyen_mai WHERE id = ?", id, (err, res) => {
    if (err) return callback(err);
    callback("Xóa thành công");
  });
};

export default khuyen_mai;
