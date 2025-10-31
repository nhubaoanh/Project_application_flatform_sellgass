import vai_tro_nv from "../models/vai_tro_nv.model.js";
// import login from "../models/vai_tro_nv.model.js"
import jwt from "jsonwebtoken";

const JWT_SECRET = "SECRET_KEY_ABC"; // nhớ để trong .env
const vai_tro_nvController = {
  // getAll: (req, res) => {
  //   vai_tro_nv.getAll((result) => res.send(result));
  // },

  getAll: (req, res) => {
    vai_tro_nv.getAll((result) => {
      if (result instanceof Error)
        return res.status(500).json({ message: result.message });
      res.json({ data: result }); // <<< đây quan trọng
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    vai_tro_nv.getById(id, (result) => res.send(result));
  },

  insert: (req, res) => {
    const data = req.body;
    vai_tro_nv.insert(data, (result) => res.send(result));
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    vai_tro_nv.update(data, id, (result) => res.send(result));
  },

  delete: (req, res) => {
    const id = req.params.id;
    vai_tro_nv.delete(id, (result) => res.send(result));
  },
  login: (req, res) => {
    const { email, matkhau } = req.body;

    vai_tro_nv.login(email, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Lỗi server" });
      }

      if (!user) {
        return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
      }

      if (user.matkhau.trim() !== matkhau.trim()) {
        return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
      }

      const token = jwt.sign(
        { manv: user.manv, mavt: user.mavt, hoten: user.hoten },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user.manv,
            manv: user.manv,
            mavt: user.mavt,
            hoten: user.hoten,
          },
          token,
        },
      });
    });
  },

  loginUser: (req, res) => {
    const { email, password } = req.body;
    vai_tro_nv.loginUser(email, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Lỗi server" });
      }

      if (!user) {
        return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
      }

      if (user.password.trim() !== password.trim()) {
        return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
      }

      const token = jwt.sign(
        { makh: user.makh, mavt: user.mavt, email: user.email, hoten: user.hoten },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.json({
        success: true,
        data: {
          user: {
            makh: user.makh,
            mavt: user.mavt,
            email: user.email,
            hoten: user.hoten,
          },
          token,
        },
      });
    });

  }
};
export default vai_tro_nvController