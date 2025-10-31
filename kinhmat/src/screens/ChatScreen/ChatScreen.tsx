import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import io, { Socket } from "socket.io-client";

// --- Cấu hình socket ---
// const SOCKET_URL =
//   Platform.OS === "android"
//     ? "https://kdckwr3m-7890.asse.devtunnels.ms" // Android emulator hoặc thiết bị thật qua tunnel
//     : Platform.OS === "ios"
//     ? "http://localhost:7890"
//     : "http://192.168.1.7:7890";

const SOCKET_URL = "https://kdckwr3m-7890.asse.devtunnels.ms";

const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

interface Message {
  message: string;
  sender: "user" | "staff";
  timestamp: Date;
}

export const ChatScreen: React.FC = () => {
  const { userId, staffId } = useLocalSearchParams<{
    userId: string;
    staffId: string;
  }>();

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStaffOnline, setIsStaffOnline] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  const parsedUserId = parseInt(userId, 10);
  const parsedStaffId = parseInt(staffId, 10);
  const roomId = `chat_${parsedUserId}_${parsedStaffId}`;

  // --- Socket events ---
  useEffect(() => {
    if (!parsedUserId || !parsedStaffId) return;

    socket.emit("join_room", roomId);

    socket.on("staff_status", (data: { staffId: number; online: boolean }) => {
      if (data.staffId === parsedStaffId) setIsStaffOnline(data.online);
    });

    const handleReceiveMessage = (data: {
      message: string;
      sender: "user" | "staff";
      room: string;
      timestamp: string;
    }) => {
      if (data.room === roomId) {
        setMessages((prev) => [
          ...prev,
          {
            message: data.message,
            sender: data.sender,
            timestamp: new Date(data.timestamp),
          },
        ]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("staff_status");
      socket.emit("leave_room", roomId);
    };
  }, [roomId]);

  // --- Gửi tin nhắn ---
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      room: roomId,
      userId: parsedUserId,
      name: `Khách ${parsedUserId}`,
      message,
      sender: "user",
      timestamp: new Date().toISOString(),
    });

    setMessage("");
    Keyboard.dismiss(); // 🔹 ẩn bàn phím sau khi gửi
  };

  // --- Render tin nhắn ---
  const renderMessageItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        {
          alignSelf: item.sender === "user" ? "flex-end" : "flex-start",
        },
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          { backgroundColor: item.sender === "user" ? "#34C759" : "#ECECEC" },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: item.sender === "user" ? "#fff" : "#000" },
          ]}
        >
          {item.message}
        </Text>
      </View>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Chat với nhân viên hỗ trợ</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isStaffOnline ? "#34C759" : "#FF3B30" },
              ]}
            />
            <Text style={styles.statusText}>
              {isStaffOnline ? "Online" : "Offline"}
            </Text>
          </View>
        </View>

        {/* Tin nhắn */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderMessageItem}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
            padding: 10,
          }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Nhập tin nhắn..."
            style={styles.input}
            multiline
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    padding: 15,
    backgroundColor: "#075E54",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  statusContainer: { flexDirection: "row", alignItems: "center" },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  statusText: { fontSize: 14, color: "#fff" },

  messageContainer: { marginVertical: 5, maxWidth: "75%" },
  messageBubble: {
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: { fontSize: 16 },
  timestamp: { fontSize: 10, color: "#888", marginTop: 2, alignSelf: "flex-end" },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 25,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#34C759",
    padding: 12,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
