interface OrderItem {
  masp: number;
  soluong: number;
  dongia: number; // giữ string vì backend trả string
  tensp: string;
}

interface Order {
  madh: number;
  makh: number;
  ngaydat: string;
  tongtien: number;
  matrangthai: number;
  diachi_giao: string;
  mapt?: number;
  items: OrderItem[];
  paymentMethod: string;
}

export { Order, OrderItem };