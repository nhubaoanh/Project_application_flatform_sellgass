import { TouchableOpacity, View, Text } from "react-native";
import { useCart } from "@/src/context/CartContext";
import { Colors } from "@/constants/colors";
import { Sizes } from "@/constants/sizes";
import { useRouter } from "expo-router";

interface HeaderProps {
  user: { userId: number; username?: string; email?: string } | null;
  onLoginPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLoginPress }) => {
  const { totalItems } = useCart();
  const router = useRouter();

  const handleCartPress = () => {
    router.push("/cart");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: Sizes.md,
        paddingVertical: Sizes.sm,
        backgroundColor: Colors.huawei,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", color: Colors.white }}>
        Kính Mắt Store
      </Text>
      <View>
        {user ? (
          <>
            <Text style={{ color: Colors.white, fontSize: 16 }}>
              Xin chào 👋
            </Text>
            <Text style={{ color: Colors.white, fontSize: 14 }}>
              {user.username || user.email}
            </Text>
          </>
        ) : (
          <TouchableOpacity onPress={onLoginPress}>
            <Text style={{ color: Colors.white, fontSize: 15, marginLeft: 18 }}>
              Đăng nhập / Đăng ký
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        onPress={handleCartPress}
        style={{ position: "relative", padding: Sizes.sm }}
      >
        <Text style={{ fontSize: 24 }}>🛒</Text>
        {totalItems > 0 && (
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: Colors.error,
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 3,
            }}
          >
            <Text
              style={{ color: Colors.white, fontSize: 12, fontWeight: "bold" }}
            >
              {totalItems}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
