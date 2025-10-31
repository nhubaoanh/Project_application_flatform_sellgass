import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Sizes } from "@/constants/sizes";
import { Colors } from "@/constants/colors";
import CategoryType from "@/src/types/category";

const { width } = Dimensions.get("window");

interface CategoryGridProps {
  categories: CategoryType[];
  onPress?: (maloai: number) => void; // số bắt buộc
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onPress,
}) => (
  <View
    style={{
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    }}
  >
    {categories.map((item) => (
      <TouchableOpacity
        key={item.maloai ?? Math.random()} // fallback nếu undefined
        style={{
          width: (width - Sizes.md * 3) / 3,
          aspectRatio: 1,
          borderRadius: Sizes.md,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: Sizes.sm,
          backgroundColor: Colors.huawei,
        }}
        onPress={() => {
          if (item.maloai !== undefined) {
            onPress?.(item.maloai); // gọi chỉ khi có số
          }
        }}
      >
        <Text style={{ fontSize: 32 }}>
          {item.maloai === 1
            ? "👓"
            : item.maloai === 2
            ? "🕶️"
            : item.maloai === 3
            ? "🔍"
            : "📦"}
        </Text>
        <Text
          style={{
            color: Colors.white,
            fontWeight: "500",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          {item.tenloai}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default CategoryGrid;
