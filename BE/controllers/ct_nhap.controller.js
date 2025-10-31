import ct_nhap from "../models/ct_nhap.model.js";

const ct_nhapController = {
  getAll: (req, res) => {
    ct_nhap.getAll((result) => res.send(result));
  },

  getById: (req, res) => {
    const id = req.params.id;
    ct_nhap.getById(id, (result) => res.send(result));
  },

  insert: (req, res) => {
    const data = req.body;
    ct_nhap.insert(data, (result) => res.send(result));
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    ct_nhap.update(data, id, (result) => res.send(result));
  },

  delete: (req, res) => {
    const id = req.params.id;
    ct_nhap.delete(id, (result) => res.send(result));
  }
};
export default ct_nhapController