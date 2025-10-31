import db from "../common/db.js";
const ct_san_pham = (ct_san_pham) => {
this.mactsp = ct_san_pham.mactsp;
this.masp = ct_san_pham.masp;
this.docau = ct_san_pham.docau;
this.dolo = ct_san_pham.dolo;
this.truc = ct_san_pham.truc;
this.chiso_khucxa = ct_san_pham.chiso_khucxa;
this.lopphu = ct_san_pham.lopphu;
this.chatlieu_goi = ct_san_pham.chatlieu_goi;
this.do_ben = ct_san_pham.do_ben;
this.mota_chitiet = ct_san_pham.mota_chitiet;
};
ct_san_pham.getById = (id, callback) => {
  const sqlString = "SELECT * FROM ct_san_pham WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

ct_san_pham.getAll = (callback) => {
  const sqlString = "SELECT * FROM ct_san_pham";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

ct_san_pham.insert = (ct_san_pham, callback) => {
  const sqlString = "INSERT INTO ct_san_pham SET ?";
  db.query(sqlString, ct_san_pham, (err, res) => {
    if (err) return callback(err);
    callback({ id: res.insertId, ... {tableName} });
  });
};

ct_san_pham.update = (ct_san_pham, id, callback) => {
  const sqlString = "UPDATE ct_san_pham SET ? WHERE id = ?";
  db.query(sqlString, [ct_san_pham, id], (err, res) => {
    if (err) return callback(err);
    callback("Cập nhật thành công");
  });
};

ct_san_pham.delete = (id, callback) => {
  db.query("DELETE FROM ct_san_pham WHERE id = ?", id, (err, res) => {
    if (err) return callback(err);
    callback("Xóa thành công");
  });
};

export default ct_san_pham;
