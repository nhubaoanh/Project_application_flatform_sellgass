import khuyen_mai from "../models/khuyen_mai.model.js";

const khuyen_maiController = {
  getAll: (req, res) => {
    khuyen_mai.getAll((result) => res.send(result));
  },

  getById: (req, res) => {
    const id = req.params.id;
    khuyen_mai.getById(id, (result) => res.send(result));
  },

  insert: (req, res) => {
    const data = req.body;
    khuyen_mai.insert(data, (result) => res.send(result));
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    khuyen_mai.update(data, id, (result) => res.send(result));
  },

  delete: (req, res) => {
    const id = req.params.id;
    khuyen_mai.delete(id, (result) => res.send(result));
  }
};
export default khuyen_maiController