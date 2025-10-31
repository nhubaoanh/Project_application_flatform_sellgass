import db from "../common/db.js";
const loai_san_pham = (loai_san_pham) => {
this.maloai = loai_san_pham.maloai;
this.tenloai = loai_san_pham.tenloai;
};
loai_san_pham.getById = (id, callback) => {
  const sqlString = "SELECT * FROM loai_san_pham WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

loai_san_pham.getAll = (callback) => {
  const sqlString = "SELECT * FROM loai_san_pham";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

loai_san_pham.getByCategory = (maloai, callback) => {
  const sql = "CALL GetProductsByCategory(?)";
  db.query(sql, [maloai], (err, result) => {
    if(err) return callback(err, null);
    callback(null, result[0]);
  })
}

loai_san_pham.insert = (loai_san_pham, callback) => {
  const sqlString = "INSERT INTO loai_san_pham SET ?";
  db.query(sqlString, loai_san_pham, (err, res) => {
    if (err) return callback(err);
    callback({ id: res.insertId, ... {tableName} });
  });
};

loai_san_pham.update = (loai_san_pham, id, callback) => {
  const sqlString = "UPDATE loai_san_pham SET ? WHERE id = ?";
  db.query(sqlString, [loai_san_pham, id], (err, res) => {
    if (err) return callback(err);
    callback("Cập nhật thành công");
  });
};

loai_san_pham.delete = (id, callback) => {
  db.query("DELETE FROM loai_san_pham WHERE id = ?", id, (err, res) => {
    if (err) return callback(err);
    callback("Xóa thành công");
  });
};

export default loai_san_pham;
