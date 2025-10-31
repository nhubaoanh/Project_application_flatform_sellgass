import db from "../common/db.js";
const san_pham = (san_pham) => {
this.masp = san_pham.masp;
this.tensp = san_pham.tensp;
this.maloai = san_pham.maloai;
this.thuonghieu = san_pham.thuonghieu;
this.chatlieu = san_pham.chatlieu;
this.mausac = san_pham.mausac;
this.kieudang = san_pham.kieudang;
this.kichthuoc = san_pham.kichthuoc;
this.mota = san_pham.mota;
this.gia = san_pham.gia;
this.tonkho = san_pham.tonkho;
this.mancc = san_pham.mancc;
this.ngaytao = san_pham.ngaytao;
this.hinhanh = san_pham.hinhanh;
};
san_pham.getById = (id, callback) => {
  const sqlString = "SELECT * FROM san_pham WHERE masp = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) return callback(err);
    callback(null,result[0]);
  });
};

san_pham.getAll = (callback) => {
  const sqlString = "SELECT * FROM san_pham";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(result);
  });
};

// san_pham.insert = (san_pham, callback) => {
//   const sqlString = "INSERT INTO san_pham SET ?";
//   db.query(sqlString, san_pham, (err, res) => {
//     if (err) return callback(err);
//     callback({ id: res.insertId, ... {san_pham} });
//   });
// };
san_pham.insert = (data, callback) => {
  const sqlString = "INSERT INTO san_pham SET ?";
  db.query(sqlString, data, (err, res) => {
    if (err) {
      console.error("❌ SQL Insert Error:", err);
      return callback(err);
    }

    console.log("✅ Rows affected:", res.affectedRows);
    callback({
      success: res.affectedRows > 0,
      id: res.insertId,
      ...data,
    });
  });
};



san_pham.update = (san_pham, id, callback) => {
  
  const sqlString = "UPDATE san_pham SET ? WHERE masp = ?";
  // console.log('SQL query:', sqlString);
  
  db.query(sqlString, [san_pham, id], (err, res) => {
    // console.log('Database query result:', { err, res });
    if (err) {
      console.error('Database update error:', err);
      return callback(err);
    }
    // console.log('Rows affected:', res.affectedRows);
    // console.log('=== END MODEL DEBUG ===');
    callback("Cập nhật thành công");
  });
};



san_pham.delete = (id, callback) => {
  const sql = "CALL DeleteSanPham(?)";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Lỗi khi gọi procedure DeleteSanPham:", err);
      return callback({ message: "Lỗi khi xóa mềm sản phẩm", error: err });
    }

    console.log("Đã xóa mềm sản phẩm có mã:", id);
    callback(null, { message: "Xóa mềm sản phẩm thành công", id });
  });
};

san_pham.getNoiBat = (callback) => {
  const sqlString = "CALL sp_getsanphamNoibat()";
  db.query(sqlString, (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy sản phẩm nổi bật:", err);
      return callback(err);
    }
    // result[0] là dữ liệu thực
    console.log("Kết quả trả về từ MySQL:", result); // ✅
    callback(result[0], null);
  });
};



export default san_pham;
