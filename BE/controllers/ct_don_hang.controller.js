import ct_don_hang from "../models/ct_don_hang.model.js";

const ct_don_hangController = {
  getAll: (req, res) => {
    ct_don_hang.getAll((result) => res.send(result));
  },

  getById: (req, res) => {
    const id = req.params.id;
    ct_don_hang.getById(id, (result) => res.send(result));
  },

  insert: (req, res) => {
    const data = req.body;
    ct_don_hang.insert(data, (result) => res.send(result));
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    ct_don_hang.update(data, id, (result) => res.send(result));
  },

  delete: (req, res) => {
    const id = req.params.id;
    ct_don_hang.delete(id, (result) => res.send(result));
  }
};
export default ct_don_hangController