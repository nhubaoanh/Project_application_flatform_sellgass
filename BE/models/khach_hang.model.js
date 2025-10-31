import db from "../common/db.js";
const khach_hang = (khach_hang) => {
this.makh = khach_hang.makh;
this.hoten = khach_hang.hoten;
this.gioitinh = khach_hang.gioitinh;
this.ngaysinh = khach_hang.ngaysinh;
this.sdt = khach_hang.sdt;
this.email = khach_hang.email;
this.diachi = khach_hang.diachi;
this.diemtl = khach_hang.diemtl;
this.mahang = khach_hang.mahang;
this.ngaytao = khach_hang.ngaytao;
};
khach_hang.getById = (id, callback) => {
  const sqlString = "SELECT * FROM khach_hang WHERE makh = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

khach_hang.getAll = (callback) => {
  const sqlString = "SELECT * FROM khach_hang";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

khach_hang.insert = (khach_hang, callback) => {
  const sqlString = "INSERT INTO khach_hang SET ?";
  db.query(sqlString, khach_hang, (err, res) => {
    if (err) return callback(err);
    callback({ id: res.insertId, ... {khach_hang} });
  });
};

khach_hang.update = (khach_hang, id, callback) => {
  const sqlString = "UPDATE khach_hang SET ? WHERE makh = ?";
  db.query(sqlString, [khach_hang, id], (err, res) => {
    if (err) return callback(err);
    callback("Cập nhật thành công");
  });
};

khach_hang.delete = (id, callback) => {
  db.query("DELETE FROM khach_hang WHERE id = ?", id, (err, res) => {
    if (err) return callback(err);
    callback("Xóa thành công");
  });
};

khach_hang.checkCustom = (hoten, sdt, diachi, callback) => {
  const sqlString = "CALL sp_CheckOrCreateCustomer(?, ?, ?)";
  db.query(sqlString, [hoten, sdt, diachi], (err, result) => {
    if (err) return callback(err);

    const data = result[0][0];
    callback(null, data);
  });
};



export default khach_hang;
