import khach_hang from "../models/khach_hang.model.js";

const khach_hangController = {
  getAll: (req, res) => {
    khach_hang.getAll((result) => res.send(result));
  },

  getById: (req, res) => {
    const id = req.params.id;
    khach_hang.getById(id, (result) => res.send(result));
  },

  insert: (req, res) => {
    const data = req.body;
    khach_hang.insert(data, (result) => res.send(result));
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    khach_hang.update(data, id, (result) => res.send(result));
  },

  delete: (req, res) => {
    const id = req.params.id;
    khach_hang.delete(id, (result) => res.send(result));
  },
  checkCustom: (req, res) => {
    const { hoten, sdt, diachi } = req.body;

    khach_hang.checkCustom(hoten, sdt, diachi, (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Lỗi khi kiểm tra khách hàng", error: err });
      }

      // Trả về dữ liệu khách hàng vừa tìm/thêm
      return res.json({
        message: "Lấy thành công",
        data: result, // chứa thông tin khách hàng (makh, hoten, sdt, diachi)
      });
    });
  },
};
export default khach_hangController