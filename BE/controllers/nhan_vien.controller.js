import nhan_vien from "../models/nhan_vien.model.js";

const nhan_vienController = {
  getAll: (req, res) => {
    nhan_vien.getAll((result) => res.send(result));
  },

  getById: (req, res) => {
    const id = req.params.id;
    nhan_vien.getById(id, (result) => res.json({message: "Lay thanh cong"}, result));
  },

  insert: (req, res) => {
    const data = req.body;
    nhan_vien.insert(data, (result) => res.json({message: "Them thanh cong"},result));
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    nhan_vien.update(data, id, (result) => res.json({message: "Cap nhat thanh cong"},result));
  },

  delete: (req, res) => {
    console.log("Controller delete gọi params:", req.params);
    const manv = parseInt(req.params.manv, 10);
    if (isNaN(manv)) return res.status(400).json({ message: "Invalid manv" });

    nhan_vien.delete(manv, (err, result) => {
      if (err) {
        console.error("Service error:", err);
        return res.status(500).json({ message: err.message });
      }
      console.log("Controller trả về:", result);
      res.status(200).json(result); // Luôn có data
    });
  },
};
export default nhan_vienController