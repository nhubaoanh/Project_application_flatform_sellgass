import ct_san_pham from "../models/ct_san_pham.model.js";

const ct_san_phamController = {
  getAll: (req, res) => {
    ct_san_pham.getAll((result) => res.send(result));
  },

  getById: (req, res) => {
    const id = req.params.id;
    ct_san_pham.getById(id, (result) => res.send(result));
  },

  insert: (req, res) => {
    const data = req.body;
    ct_san_pham.insert(data, (result) => res.send(result));
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    ct_san_pham.update(data, id, (result) => res.send(result));
  },

  delete: (req, res) => {
    const id = req.params.id;
    ct_san_pham.delete(id, (result) => res.send(result));
  }
};
export default ct_san_phamController