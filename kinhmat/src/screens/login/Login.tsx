import { Colors } from "@/constants/colors";
import { Sizes } from "@/constants/sizes";
import apiService from "@/src/service/apiService";
import { userStorage } from "@/src/utils/userStorage";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useUser } from "../../context/UserContext"; // path đúng với project của bạn


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useUser();


  console.log(email, password);

// const handleLogin = async () => {
//   if (!email || !password) {
//     Alert.alert("Vui lòng nhập đầy đủ thông tin");
//     return;
//   }

//   try {
//     const res = await apiService.login(email, password);
//     console.log("Login response:", res);

//     if (res.success) {
//       // Lấy token đúng theo cấu trúc backend
//       const token = res.data?.token || res.data?.data?.token;
//       Alert.alert("Đăng nhập thành công");
//       console.log("Token:", token);

//       // Chuyển trang
//       router.push("/(drawers)");
//     } else {
//       Alert.alert("Đăng nhập không thành công", res.error || "Sai thông tin");
//     }
//   } catch (err) {
//     Alert.alert("Lỗi", "Không thể kết nối đến server");
//     console.log("Login error:", err);
//   }
// };

const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  try {
    const res = await apiService.login(email, password);
    console.log("Login response:", res);

    if (res.success) {
      const userId = res.data.user.makh;
      const token = res.data.token;
      const username = res.data.user.hoten;

      await userStorage.addUser(userId, token, username);

      login({ userId, username, token });

      Alert.alert("Đăng nhập thành công");
      console.log("Đã lưu user:", userId, token, username);

      router.push("/(drawers)");
    } else {
      Alert.alert("Đăng nhập không thành công", res.error || "Sai thông tin");
    }
  } catch (err) {
    Alert.alert("Lỗi", "Không thể kết nối đến server");
    console.log("Login error:", err);
  }
};


  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Đăng nhập</Text>

        <View style={styles.loginContainer}>
            <TextInput
                placeholder="Tên đăng nhập"
                placeholderTextColor={Colors.textSecondary}
                style={styles.input}
                onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                placeholder="Mật khẩu"
                placeholderTextColor={Colors.textSecondary}
                secureTextEntry
                style={styles.input}
                onChangeText={(text) => setPassword(text)}
                />

            <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
              <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Sizes.md,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Sizes.lg,
    color: Colors.primary,
  },
  loginContainer: {
    backgroundColor: Colors.white,
    padding: Sizes.lg,
    borderRadius: Sizes.md,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizes.sm,
    padding: Sizes.md,
    marginBottom: Sizes.md,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Sizes.md,
    borderRadius: Sizes.sm,
    alignItems: "center",
    marginTop: Sizes.md,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotText: {
    textAlign: "center",
    color: Colors.secondary,
    marginTop: Sizes.md,
  },
});
