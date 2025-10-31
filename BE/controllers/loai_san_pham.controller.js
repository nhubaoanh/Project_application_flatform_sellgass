import loai_san_pham from "../models/loai_san_pham.model.js";

const loai_san_phamController = {
  getAll: (req, res) => {
    loai_san_pham.getAll((result) => res.send(result));
  },

  getById: (req, res) => {
    const id = req.params.id;
    loai_san_pham.getById(id, (result) => res.send(result));
  },

  insert: (req, res) => {
    const data = req.body;
    loai_san_pham.insert(data, (result) => res.send(result));
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    loai_san_pham.update(data, id, (result) => res.send(result));
  },

  delete: (req, res) => {
    const id = req.params.id;
    loai_san_pham.delete(id, (result) => res.send(result));
  },
  getCategory: (req, res) => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Thiếu ID danh mục" });
    }

    loai_san_pham.getByCategory(id, (err, data) => {
      if (err) {
        console.error("Lỗi khi lấy sản phẩm theo loại:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }

      if (!data || data.length === 0) {
        return res.status(200).json({
          maloai: id,
          tenloai: "Không có sản phẩm",
          sanpham: [],
        });
      }

      res.status(200).json({
        maloai: id,
        tenloai: data[0]?.tenloai || "Danh mục",
        sanpham: data,
      });
    });
  },
};
export default loai_san_phamController;
