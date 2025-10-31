import nha_cung_cap from "../models/nha_cung_cap.model.js";

const nha_cung_capController = {
  getAll: (req, res) => {
    nha_cung_cap.getAll((result) => res.send(result));
  },

  getById: (req, res) => {
    const id = req.params.id;
    nha_cung_cap.getById(id, (result) => res.send(result));
  },

  insert: (req, res) => {
    const data = req.body;
    nha_cung_cap.insert(data, (result) => res.send(result));
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    nha_cung_cap.update(data, id, (result) => res.send(result));
  },

  delete: (req, res) => {
    const id = req.params.id;
    nha_cung_cap.delete(id, (result) => res.send(result));
  }
};
export default nha_cung_capController