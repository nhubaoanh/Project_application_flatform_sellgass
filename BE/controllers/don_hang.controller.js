import don_hang from "../models/don_hang.model.js";

const don_hangController = {
  // getAll: (req, res) => {
  //   don_hang.getAll((result) => res.send(result));
  // },

  // getById: (req, res) => {
  //   const id = req.params.id;
  //   don_hang.getById(id, (result) => res.send(result));
  // },
  getAll: (req, res) => {
    don_hang.getAll((err, rows) => {
      if (err)
        return res.status(500).json({ success: false, message: "Lỗi server" });

      // gom nhóm orders + items
      const orders = [];
      const orderMap = {};

      rows.forEach((row) => {
        if (!orderMap[row.madh]) {
          orderMap[row.madh] = {
            madh: row.madh,
            makh: row.makh,
            ngaydat: row.ngaydat,
            tongtien: row.tongtien,
            matrangthai: row.matrangthai,
            diachi_giao: row.diachi_giao,
            paymentMethod: row.paymentMethod,
            items: [],
          };
          orders.push(orderMap[row.madh]);
        }

        if (row.masp) {
          orderMap[row.madh].items.push({
            masp: row.masp,
            tensp: row.tensp,
            hinhanh: row.hinhanh,
            soluong: row.soluong,
            dongia: row.dongia,
          });
        }
      });

      res.json({ success: true, data: orders });
    });
  },

  getById: (req, res) => {
    don_hang.getById(req.params.id, (err, rows) => {
      if (err)
        return res.status(500).json({ success: false, message: "Lỗi server" });
      res.json({ success: true, data: rows });
    });
  },

  insert: (req, res) => {
    const data = req.body;
    don_hang.insert(data, (result) => res.send(result));
  },

  // insertorder : (req, res) => {
  //   const data = req.body;
  //   don_hang.insertOrder(data, (result) => res.send(result));
  // },
  insertorder: (req, res) => {
    const data = req.body;

    don_hang.insertOrder(data, (err, result) => {
      if (err) {
        console.error("❌ Lỗi tạo đơn hàng:", err);
        return res.status(500).json({
          success: false,
          message: "Lỗi khi tạo đơn hàng",
          error: err.sqlMessage || err.message,
        });
      }

      // ✅ Thành công
      res.json({
        success: true,
        madh: result.madh,
        message: result.message,
      });
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    don_hang.update(data, id, (result) => res.send(result));
  },

  delete: (req, res) => {
    const id = req.params.id;
    don_hang.delete(id, (result) => res.send(result));
  },

  getMyOrders: (req, res) => {
    const { makh } = req.params; // hoặc req.query nếu truyền query param

    if (!makh) {
      return res.status(400).json({
        success: false,
        message: "Thiếu mã khách hàng (makh)",
      });
    }

    // Gọi model
    don_hang.getMyOrders(makh, (err, orders) => {
      if (err) {
        console.error("❌ Lỗi khi lấy đơn hàng:", err);
        return res.status(500).json({
          success: false,
          message: "Lỗi khi lấy danh sách đơn hàng",
          error: err.message,
        });
      }

      // Trả về JSON
      res.status(200).json({
        success: true,
        message: "Lấy danh sách đơn hàng thành công",
        data: orders,
      });
    });
  },

  getDashboardData: (req, res) => {
    // console.log("🟡 Controller: vào getDashboardData");
    don_hang.getDashboardData((err, data) => {
      if (err) {
        console.error("🔴 Lỗi từ model:", err);
        return res.status(500).json({ success: false, message: "Lỗi server" });
      }
      console.log("📊 Dữ liệu dashboard nhận từ model:", data);
      res.json({ success: true, data });
    });
  },
};
export default don_hangController;
