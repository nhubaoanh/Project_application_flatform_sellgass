import dotenv from "dotenv";
import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { Server} from "socket.io";

import sanphamRoutes from "../routes/san_pham.routes.js";
import khachhangRoutes from "../routes/khach_hang.routes.js";
import nhacungcapRoutes from "../routes/nha_cung_cap.routes.js";
import nhanvienRoutes from "../routes/nhan_vien.routes.js";
import chitietdonhangRoutes from "../routes/ct_don_hang.routes.js";
import chitietnhapRoutes from "../routes/ct_nhap.routes.js";
import chitietsanphamRoutes from "../routes/ct_san_pham.routes.js";
import donhangRoutes from "../routes/don_hang.routes.js";
import hangRoutes from "../routes/hang_tv.routes.js";
import hoadonnhapRoutes from "../routes/hoa_don_nhap.routes.js";
import khuyenmaiRoutes from "../routes/khuyen_mai.routes.js";
import loaisanphamRoutes from "../routes/loai_san_pham.routes.js";
import vaitroRoutes from "../routes/vai_tro_nv.routes.js";
import trangthaidonhangRoutes from "../routes/trang_thai_don_hang.routes.js";
import chatRoutes from "../routes/chat.routes.js"; // 🆕 import
import http from "http";
const app = express();
dotenv.config(); // phải đứng đầu

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
const port = process.env.PORT || 7890;

const server =http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
})

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room: ${roomId}`);
  });

  // socket.on("send_message", (data) => {
  //   io.to(data.room).emit("receive_message", data);
  // });

  // socket.on("send_message", (data) => {
  //   io.to(data.room).emit("receive_message", data);

  //   // 🟢 Khi khách hàng nhắn tin => gửi thông báo cho nhân viên
  //   if (data.senderRole === "customer") {
  //     io.emit("new_message", {
  //       userId: data.userId, // id khách hàng
  //       name: data.name, // tên khách hàng
  //       message: data.message, // nội dung tin nhắn
  //     });
  //   }
  // });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);

    // ✅ Nếu người gửi là KHÁCH HÀNG thì gửi thông báo cho nhân viên
    if (data.sender === "user") {
      io.emit("new_message", {
        userId: data.userId,
        name: data.name || `Khách ${data.userId}`,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    }
  });



  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.post("/api/chat/createRoom", (req, res) => {
  const { userId, staffId } = req.body;
  const roomId = `chat_${userId}_${staffId}`;
  res.json({ roomId });
});


// server.listen(3000, () => console.log("Chat server running on port http://localhost:3000"));
// // serve static uploads
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// app.use("/uploads", express.static(join(__dirname, "..", "uploads")));

// dùng routes

app.use("/api/sanpham", sanphamRoutes);
app.use("/api/khachhang", khachhangRoutes);
app.use("/api/nhacungcap", nhacungcapRoutes);
app.use("/api/nhanvien", nhanvienRoutes);
app.use("/api/chitietdonhang", chitietdonhangRoutes);
app.use("/api/chitietnhap", chitietnhapRoutes);
app.use("/api/chitietsanpham", chitietsanphamRoutes);
app.use("/api/hang", hangRoutes);
app.use("/api/hoadonnhap", hoadonnhapRoutes);
app.use("/api/khuyenmai", khuyenmaiRoutes);
app.use("/api/danhmuc", loaisanphamRoutes);
app.use("/api/vaitro", vaitroRoutes);
app.use("/api/trangthaidonhang", trangthaidonhangRoutes);
app.use("/api/orders", donhangRoutes);

app.use("/api/chat", chatRoutes)

server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
  console.log("Key đang dùng:", process.env.GEMINI_API_KEY); // THÊM DÒNG NÀY
});
