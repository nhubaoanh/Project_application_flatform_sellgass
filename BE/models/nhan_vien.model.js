import db from "../common/db.js";
const nhan_vien = (nhan_vien) => {
  this.manv = nhan_vien.manv;
  this.hoten = nhan_vien.hoten;
  this.mavt = nhan_vien.mavt;
  this.sdt = nhan_vien.sdt;
  this.email = nhan_vien.email;
  this.lichlv = nhan_vien.lichlv;
};
nhan_vien.getById = (id, callback) => {
  const sqlString = "SELECT * FROM nhan_vien WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

nhan_vien.getAll = (callback) => {
  const sqlString = "SELECT * FROM nhan_vien";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

nhan_vien.insert = (nhan_vien, callback) => {
  const sqlString = "INSERT INTO nhan_vien SET ?";
  db.query(sqlString, nhan_vien, (err, res) => {
    if (err) return callback(err);
    callback({ id: res.insertId, ...{ nhan_vien } });
  });
};

nhan_vien.update = (nhan_vien, id, callback) => {
  const sqlString = "UPDATE nhan_vien SET ? WHERE manv = ?";
  db.query(sqlString, [nhan_vien, id], (err, res) => {
    if (err) return callback(err);
    callback("Cập nhật thành công");
  });
};

nhan_vien.delete = (manv, callback) => {
  const sqlString = "CALL DeleteUser(?, @p_error_code, @p_error_message)";

  db.query(sqlString, [manv], (err, results) => {
    if (err) {
      console.error("Database error in delete:", err);
      return callback(err);
    }

    // Sau khi gọi xong procedure, ta lấy ra giá trị OUT
    db.query(
      "SELECT @p_error_code AS errorCode, @p_error_message AS errorMessage",
      (err2, rows) => {
        if (err2) {
          console.error("Error getting output params:", err2);
          return callback(err2);
        }

        const { errorCode, errorMessage } = rows[0];
        console.log("Output từ procedure:", { errorCode, errorMessage });

        // Nếu có lỗi do procedure báo (ví dụ nhân viên không tồn tại)
        if (errorCode && errorCode !== 0) {
          return callback(new Error(errorMessage || "Lỗi không xác định"));
        }

        // Nếu không có lỗi, trả về kết quả SELECT trong procedure
        const affectedRows =
          results[0] && results[0][0] ? results[0][0].affectedRows : 0;

        callback(null, {
          manv,
          affectedRows,
          message: "Xóa thành công",
        });
      }
    );
  });
};

export default nhan_vien;
