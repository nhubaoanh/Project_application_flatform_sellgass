import trang_thai_don_hang from "../models/trang_thai_don_hang.model.js";

const trang_thai_don_hangController = {
  getAll: (req, res) => {
    trang_thai_don_hang.getAll((result) => res.send(result));
  },

  getById: (req, res) => {
    const id = req.params.id;
    trang_thai_don_hang.getById(id, (result) => res.send(result));
  },

  insert: (req, res) => {
    const data = req.body;
    trang_thai_don_hang.insert(data, (result) => res.send(result));
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    trang_thai_don_hang.update(data, id, (result) => res.send(result));
  },

  delete: (req, res) => {
    const id = req.params.id;
    trang_thai_don_hang.delete(id, (result) => res.send(result));
  }
};
export default trang_thai_don_hangController