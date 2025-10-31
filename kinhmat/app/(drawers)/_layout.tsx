import { Stack } from "expo-router";
import Drawer from "expo-router/drawer";

export default function DrawerLayout(){
    return(
        <Drawer screenOptions={{
            headerShown: true,
            drawerType: "slide",
            drawerActiveTintColor: "#007AFF", // màu khi chọn - sử dụng primary color
            drawerInactiveTintColor: "#8E8E93", // màu khi không chọn
            headerTintColor: "#007AFF", // màu header
        }}>
            <Stack.Screen options={{ headerShown: false }} />
            <Drawer.Screen name="index" options={{title:"🏠 Home",drawerLabel: "Trang chủ"}}/>
            <Drawer.Screen name="admin" options={{title:"🔧 Admin",drawerLabel: "Quản trị"}}/>
        </Drawer>
    )
}