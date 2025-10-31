import db from "../common/db.js";
const vai_tro_nv = (vai_tro_nv) => {
this.mavt = vai_tro_nv.mavt;
this.tenvt = vai_tro_nv.tenvt;
};
vai_tro_nv.getById = (id, callback) => {
  const sqlString = "SELECT * FROM vai_tro_nv WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

vai_tro_nv.getAll = (callback) => {
  const sqlString = "SELECT * FROM vai_tro_nv";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

vai_tro_nv.insert = (vai_tro_nv, callback) => {
  const sqlString = "INSERT INTO vai_tro_nv SET ?";
  db.query(sqlString, vai_tro_nv, (err, res) => {
    if (err) return callback(err);
    callback({ id: res.insertId, ... {tableName} });
  });
};

vai_tro_nv.update = (vai_tro_nv, id, callback) => {
  const sqlString = "UPDATE vai_tro_nv SET ? WHERE id = ?";
  db.query(sqlString, [vai_tro_nv, id], (err, res) => {
    if (err) return callback(err);
    callback("Cập nhật thành công");
  });
};

vai_tro_nv.delete = (id, callback) => {
  db.query("DELETE FROM vai_tro_nv WHERE id = ?", id, (err, res) => {
    if (err) return callback(err);
    callback("Xóa thành công");
  });
};

vai_tro_nv.login = (email, callback) => {
  const sqlString = "SELECT manv, hoten, email, matkhau, mavt FROM nhan_vien WHERE email = ?";
  db.query(sqlString, [email], (err, result) => {
    if (err) return callback(err);
    callback(null,result[0]);
  })
}

vai_tro_nv.loginUser = (email, callback) => {
  const sqlString = "SELECT * FROM khach_hang WHERE email = ?";
  db.query(sqlString, [email], (err, result) => {
    if (err) return callback(err);
    callback(null,result[0]);
  })
}

export default vai_tro_nv;
