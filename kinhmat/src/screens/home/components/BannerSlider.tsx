import React from "react";
import {
  FlatList,
  Text,
  View,
  Dimensions,
  ImageBackground,
} from "react-native";
import { Button } from "@/src/components/ui/Button";
import { Colors } from "@/constants/colors";
import { Sizes } from "@/constants/sizes";
import { TouchableOpacity } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  color?: string;
}

interface BannerSliderProps {
  banners: Banner[];
  bannerRef: React.RefObject<FlatList<any> | null>;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({
  banners,
  bannerRef,
  currentIndex,
  setCurrentIndex,
}) => (
  <View style={{ padding: Sizes.md }}>
    <FlatList
      ref={bannerRef}
      data={banners}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <ImageBackground
          source={{ uri: item.image }}
          imageStyle={{ borderRadius: Sizes.md }}
          style={{
            width: width - Sizes.md * 2,
            height: 180,
            borderRadius: Sizes.md,
            overflow: "hidden",
            justifyContent: "flex-end",
          }}
        >
          {/* <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60%",
              borderRadius: Sizes.md,
            }}
          /> */}

          <View style={{ padding: Sizes.lg }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: Colors.white,
                marginBottom: Sizes.xs,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                color: Colors.white,
                fontSize: 14,
                marginBottom: Sizes.sm,
              }}
            >
              {item.subtitle}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.secondary,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: Sizes.sm,
              }}
              onPress={() => console.log("Xem ngay")}
            >
              <Text style={{ color: Colors.white }}>Xem ngay</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}
      onMomentumScrollEnd={(e) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
      }}
    />

    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: Sizes.sm,
      }}
    >
      {banners.map((_, index) => (
        <View
          key={index}
          style={{
            width: currentIndex === index ? 10 : 8,
            height: currentIndex === index ? 10 : 8,
            borderRadius: 5,
            marginHorizontal: 4,
            backgroundColor:
              currentIndex === index ? Colors.primary : Colors.textSecondary,
          }}
        />
      ))}
    </View>
  </View>
);
