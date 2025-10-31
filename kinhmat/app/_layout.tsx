import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import  {CartProvider}  from '../src/context/CartContext';
import { UserProvider } from '@/src/context/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <CartProvider>
        <Stack>
          <Stack.Screen
            name="(drawers)"
            options={{ headerShown: false, title: "" }}
          />
        </Stack>
      </CartProvider>
    </UserProvider>
  );
}
