import hang_tv from "../models/hang_tv.model.js";

const hang_tvController = {
  getAll: (req, res) => {
    hang_tv.getAll((result) => res.send(result));
  },

  getById: (req, res) => {
    const id = req.params.id;
    hang_tv.getById(id, (result) => res.send(result));
  },

  insert: (req, res) => {
    const data = req.body;
    hang_tv.insert(data, (result) => res.send(result));
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    hang_tv.update(data, id, (result) => res.send(result));
  },

  delete: (req, res) => {
    const id = req.params.id;
    hang_tv.delete(id, (result) => res.send(result));
  }
};
export default hang_tvController