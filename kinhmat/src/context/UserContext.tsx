import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { userStorage, UserStorageItem } from "@/src/utils/userStorage";

interface UserContextType {
  isLoggedIn: boolean;
  user: UserStorageItem | null;
  login: (user: UserStorageItem) => void;
  logout: () => void;
  navigateToLogin: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserStorageItem | null>(null);

  // 🔹 Khi app load, check xem có user hiện tại trong AsyncStorage không
  useEffect(() => {
    const checkCurrentUser = async () => {
      const currentUser = await userStorage.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);
      }
    };
    checkCurrentUser();
  }, []);

  const login = (userData: UserStorageItem) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await userStorage.logout(); // xóa currentUserId trong AsyncStorage
    setUser(null);
    setIsLoggedIn(false);
  };

  const navigateToLogin = () => {
    console.log("Điều hướng đến màn hình đăng nhập");
  };

  return (
    <UserContext.Provider
      value={{ isLoggedIn, user, login, logout, navigateToLogin }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
