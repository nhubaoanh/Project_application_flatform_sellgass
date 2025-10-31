import hoa_don_nhap from "../models/hoa_don_nhap.model.js";

const hoa_don_nhapController = {
  getAll: (req, res) => {
    hoa_don_nhap.getAll((result) => res.send(result));
  },

  getById: (req, res) => {
    const id = req.params.id;
    hoa_don_nhap.getById(id, (result) => res.send(result));
  },

  insert: (req, res) => {
    const data = req.body;
    hoa_don_nhap.insert(data, (result) => res.send(result));
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    hoa_don_nhap.update(data, id, (result) => res.send(result));
  },

  delete: (req, res) => {
    const id = req.params.id;
    hoa_don_nhap.delete(id, (result) => res.send(result));
  }
};
export default hoa_don_nhapController