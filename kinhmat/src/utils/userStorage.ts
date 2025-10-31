import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserStorageItem {
  userId: number;
  username: string;
  token: string;
  email?: string;
}

export const userStorage = {
  // 🔹 Lấy tất cả user
  async getAllUsers(): Promise<UserStorageItem[]> {
    const json = await AsyncStorage.getItem("users");
    return json ? JSON.parse(json) : [];
  },

  // 🔹 Thêm hoặc cập nhật user
  async addUser(
    userId: number,
    token: string,
    username: string,
    email?: string
  ) {
    const users = await this.getAllUsers();
    const updated = users.filter((u) => u.userId !== userId);
    updated.push({ userId, username, token, email });
    await AsyncStorage.setItem("users", JSON.stringify(updated));

    // 🔹 Đặt user này là người đang đăng nhập hiện tại
    await AsyncStorage.setItem("currentUserId", String(userId));
  },

  // 🔹 Lấy user hiện tại (đang đăng nhập)
  async getCurrentUser(): Promise<UserStorageItem | null> {
    const currentUserId = await AsyncStorage.getItem("currentUserId");
    if (!currentUserId) return null;
    const users = await this.getAllUsers();
    console.log("users:", users, "currentUserId:", currentUserId);
    return users.find((u) => u.userId === Number(currentUserId)) || null;
  },

  // 🔹 Đặt user hiện tại thủ công (khi cần chuyển user)
  async setCurrentUser(userId: number) {
    await AsyncStorage.setItem("currentUserId", String(userId));
  },

  // 🔹 Xóa 1 user
  async clearUser(userId: number) {
    const users = await this.getAllUsers();
    const updated = users.filter((u) => u.userId !== userId);
    await AsyncStorage.setItem("users", JSON.stringify(updated));

    const currentUserId = await AsyncStorage.getItem("currentUserId");
    if (currentUserId && Number(currentUserId) === userId) {
      await AsyncStorage.removeItem("currentUserId"); // Xóa trạng thái đăng nhập
    }
  },

  // 🔹 Đăng xuất (xoá người dùng hiện tại, nhưng vẫn giữ danh sách user)
  async logout() {
    await AsyncStorage.removeItem("currentUserId");
    console.log("Đăng xuat thanh cong");
  },

  // 🔹 Xoá tất cả user (nếu cần reset app)
  async clearAll() {
    await AsyncStorage.removeItem("users");
    await AsyncStorage.removeItem("currentUserId");
  },
};

