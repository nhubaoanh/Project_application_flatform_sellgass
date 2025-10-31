import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/colors";
import { Sizes } from "@/constants/sizes";
import customerService from "@/src/service/custom.service";
import { userStorage } from "@/src/utils/userStorage";
import Customer from "@/src/types/customer";
// import { Button } from "../../components/ui/Button";
import { useRouter } from "expo-router";
import { Button } from "@/src/components/ui/Button";

export const EditProfileScreen: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [form, setForm] = useState<Customer>({
    makh: 0,
    hoten: "",
    email: "",
    sdt: "",
    diachi: "",
    diemtl: 0,
    password: "",
    gioitinh: "",
  });

  // Lấy thông tin người dùng hiện tại
  useEffect(() => {
    (async () => {
      const user = await userStorage.getCurrentUser();
      if (user && user.userId) {
        setUserId(user.userId);
        const res = await customerService.getCustomerById(user.userId);
        if (res.success && res.data) setForm(res.data);
      } else {
        Alert.alert("Lỗi", "Không tìm thấy người dùng.");
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!userId) return Alert.alert("Lỗi", "Không có thông tin người dùng!");

    try {
      const res = await customerService.updateCustomer(userId, form);
      if (res.success) {
        Alert.alert("Thành công", "Cập nhật hồ sơ thành công!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Lỗi", res.error || "Không thể cập nhật hồ sơ.");
      }
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi cập nhật.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.header}>Chỉnh sửa thông tin cá nhân</Text>

        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập họ và tên"
          value={form.hoten}
          onChangeText={(text) => setForm({ ...form, hoten: text })}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập email"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          value={form.sdt}
          onChangeText={(text) => setForm({ ...form, sdt: text })}
        />

        <Text style={styles.label}>Địa chỉ</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ"
          value={form.diachi}
          onChangeText={(text) => setForm({ ...form, diachi: text })}
        />

        <Button
          title="💾 Lưu thay đổi"
          onPress={handleSave}
          variant="primary"
          size="large"
          fullWidth
          style={{ marginTop: 20 }}
        />

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Sizes.screenPadding,
  },
  header: {
    fontSize: Sizes.fontSizeXl,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: Sizes.fontSizeMd,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizes.radiusMd,
    padding: 10,
    marginBottom: 15,
    fontSize: Sizes.fontSizeMd,
    backgroundColor: Colors.white,
  },
  cancelButton: {
    marginTop: 10,
    alignItems: "center",
  },
  cancelText: {
    color: Colors.textSecondary,
    fontSize: Sizes.fontSizeMd,
  },
});
