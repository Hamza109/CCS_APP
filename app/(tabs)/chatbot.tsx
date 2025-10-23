import { Ionicons ,MaterialCommunityIcons} from "@expo/vector-icons";
import { marked } from "marked";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import RenderHtml from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../src/components/ui/Card";
import { useChat } from "../../src/hooks/useChat";
import { stripThink } from "../../src/services/chatApi";
import { useAppDispatch, useAppSelector } from "../../src/store";
import { addMessage, clearMessages } from "../../src/store/slices/chatbotSlice";

const { width } = Dimensions.get("window");

// Configure marked for better HTML output
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true, // GitHub Flavored Markdown
});

// Animated Typing Indicator Component
const AnimatedTypingIndicator: React.FC<{ theme: string }> = ({ theme }) => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const startAnimation = () => {
      // Staggered animation for more realistic typing effect
      dot1.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);

      setTimeout(() => {
        dot2.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
      }, 200);

      setTimeout(() => {
        dot3.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
      }, 400);
    };

    startAnimation();
  }, []);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot1.value, [0, 1], [0.3, 1]),
    transform: [
      {
        scale: interpolate(dot1.value, [0, 1], [0.8, 1.2]),
      },
    ],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot2.value, [0, 1], [0.3, 1]),
    transform: [
      {
        scale: interpolate(dot2.value, [0, 1], [0.8, 1.2]),
      },
    ],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot3.value, [0, 1], [0.3, 1]),
    transform: [
      {
        scale: interpolate(dot3.value, [0, 1], [0.8, 1.2]),
      },
    ],
  }));

  return (
    <View style={styles.typingIndicator}>
      <Text
        style={[styles.typingText, theme === "dark" && styles.darkTypingText]}
      >
        Bot is typing
      </Text>
      <View style={styles.typingDots}>
        <Animated.View
          style={[
            styles.typingDot,
            theme === "dark" && styles.darkTypingDot,
            dot1Style,
          ]}
        />
        <Animated.View
          style={[
            styles.typingDot,
            theme === "dark" && styles.darkTypingDot,
            dot2Style,
          ]}
        />
        <Animated.View
          style={[
            styles.typingDot,
            theme === "dark" && styles.darkTypingDot,
            dot3Style,
          ]}
        />
      </View>
    </View>
  );
};

const ChatbotScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);
  const messages = useAppSelector((state: any) => state.chatbot.messages);
  const dispatch = useAppDispatch();

  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const quickReplies = [
    "What are my legal rights?",
    "How to file a case?",
    "Find advocates near me",
    "Check case status",
    "Legal aid information",
    "Court procedures",
  ];

  const chatMutation = useChat();

  const handleSendMessage = async () => {
    const question = inputText.trim();
    if (!question) return;

    // Add user message
    dispatch(
      addMessage({
        id: Date.now().toString(),
        text: question,
        isUser: true,
        timestamp: new Date().toISOString(),
        type: "text",
      })
    );
    setInputText("");

    chatMutation.mutate(
      { question },
      {
        onSuccess: (res) => {
          const answer = stripThink(
            (res as any)?.data?.answer || "Sorry, I couldn't find an answer."
          );
          dispatch(
            addMessage({
              id: (Date.now() + 1).toString(),
              text: answer,
              isUser: false,
              timestamp: new Date().toISOString(),
              type: "text",
            })
          );
        },
        onError: (err) => {
          console.log(err);
          dispatch(
            addMessage({
              id: (Date.now() + 2).toString(),
              text: "There was a problem contacting the assistant. Please try again.",
              isUser: false,
              timestamp: new Date().toISOString(),
              type: "text",
            })
          );
        },
      }
    );
  };

  const handleQuickReply = (reply: string) => {
    setInputText(reply);
  };

  const handleClearChat = () => {
    // Cancel any ongoing API calls and reset mutation state
    chatMutation.reset();

    // Clear messages from store
    dispatch(clearMessages());
  };

  useEffect(() => {
    // Scroll to bottom when new message is added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const containerStyle = [
    styles.container,
    theme === "dark" && styles.darkContainer,
  ];

  return (
    <SafeAreaView style={containerStyle} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.botAvatar}>
              <MaterialCommunityIcons name='face-agent' size={24} color='#FFFFFF' />
            </View>
            <View style={styles.headerText}>
              <Text
                style={[styles.botName, theme === "dark" && styles.darkText]}
              >
                Legal Assistant
              </Text>
              <Text
                style={[
                  styles.botStatus,
                  theme === "dark" && styles.darkSubtext,
                ]}
              >
                Online • Ready to help
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleClearChat}
            style={[
              styles.clearButton,
              chatMutation.isPending && styles.clearButtonActive,
            ]}
          >
            <Ionicons
              name='trash'
              size={20}
              color={chatMutation.isPending ? "#FF3B30" : "#6C757D"}
            />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.length === 0 && (
            <View style={styles.welcomeContainer}>
              <Text
                style={[
                  styles.welcomeTitle,
                  theme === "dark" && styles.darkText,
                ]}
              >
                Welcome to Legal Assistant
              </Text>
              <Text
                style={[
                  styles.welcomeDescription,
                  theme === "dark" && styles.darkSubtext,
                ]}
              >
                I&apos;m here to help you with legal queries, find advocates,
                check case status, and provide legal guidance.
              </Text>

              <View style={styles.quickRepliesContainer}>
                <Text
                  style={[
                    styles.quickRepliesTitle,
                    theme === "dark" && styles.darkText,
                  ]}
                >
                  Quick Questions:
                </Text>
                <View style={styles.quickRepliesGrid}>
                  {quickReplies.map((reply, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.quickReplyButton}
                      onPress={() => handleQuickReply(reply)}
                    >
                      <Text style={styles.quickReplyText}>{reply}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {messages.map((message: any) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Card
                style={
                  [
                    styles.messageCard,
                    message.isUser
                      ? styles.userMessageCard
                      : styles.botMessageCard,
                  ] as any
                }
              >
                {message.isUser ? (
                  <Text style={[styles.messageText, styles.userMessageText]}>
                    {message.text}
                  </Text>
                ) : (
                  <RenderHtml
                    contentWidth={width * 0.75 - 24} // Account for padding
                    source={{ html: marked.parse(message.text) as string }}
                    tagsStyles={{
                      p: {
                        fontSize: 16,
                        lineHeight: 22,
                        color: theme === "dark" ? "#FFFFFF" : "#333333",
                        margin: 0,
                        marginBottom: 8,
                      },
                      strong: {
                        fontWeight: "bold",
                        color: theme === "dark" ? "#FFFFFF" : "#333333",
                      },
                      em: {
                        fontStyle: "italic",
                        color: theme === "dark" ? "#FFFFFF" : "#333333",
                      },
                      ul: {
                        margin: 0,
                        paddingLeft: 16,
                      },
                      ol: {
                        margin: 0,
                        paddingLeft: 16,
                      },
                      li: {
                        fontSize: 16,
                        lineHeight: 22,
                        color: theme === "dark" ? "#FFFFFF" : "#333333",
                        marginBottom: 4,
                      },
                      a: {
                        color: "#007AFF",
                        textDecorationLine: "underline",
                      },
                      h1: {
                        fontSize: 20,
                        fontWeight: "bold",
                        color: theme === "dark" ? "#FFFFFF" : "#333333",
                        margin: 0,
                        marginBottom: 8,
                      },
                      h2: {
                        fontSize: 18,
                        fontWeight: "bold",
                        color: theme === "dark" ? "#FFFFFF" : "#333333",
                        margin: 0,
                        marginBottom: 8,
                      },
                      h3: {
                        fontSize: 16,
                        fontWeight: "bold",
                        color: theme === "dark" ? "#FFFFFF" : "#333333",
                        margin: 0,
                        marginBottom: 8,
                      },
                      code: {
                        backgroundColor:
                          theme === "dark" ? "#2C2C2E" : "#F1F1F1",
                        color: theme === "dark" ? "#FFFFFF" : "#333333",
                        padding: 4,
                        borderRadius: 4,
                        fontFamily:
                          Platform.OS === "ios" ? "Courier" : "monospace",
                      },
                      pre: {
                        backgroundColor:
                          theme === "dark" ? "#2C2C2E" : "#F1F1F1",
                        color: theme === "dark" ? "#FFFFFF" : "#333333",
                        padding: 8,
                        borderRadius: 4,
                        fontFamily:
                          Platform.OS === "ios" ? "Courier" : "monospace",
                        margin: 0,
                        marginBottom: 8,
                      },
                    }}
                  />
                )}
                <Text
                  style={[
                    styles.messageTime,
                    message.isUser
                      ? styles.userMessageTime
                      : styles.botMessageTime,
                  ]}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Card>
            </View>
          ))}

          {chatMutation.isPending && (
            <View style={styles.loadingContainer}>
              <Card style={styles.botMessageCard}>
                <AnimatedTypingIndicator theme={theme} />
              </Card>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View
          style={[
            styles.inputContainer,
            theme === "dark" && styles.darkInputContainer,
          ]}
        >
          <View
            style={[
              styles.inputWrapper,
              theme === "dark" && styles.darkInputWrapper,
            ]}
          >
            <TextInput
              style={[
                styles.textInput,
                theme === "dark" && styles.darkTextInput,
              ]}
              placeholder='Type your legal query...'
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              placeholderTextColor='#6C757D'
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || chatMutation.isPending}
            >
              <Ionicons
                name='send'
                size={20}
                color={inputText.trim() ? "#FFFFFF" : "#6C757D"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  darkContainer: {
    backgroundColor: "#000000",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  botName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  botStatus: {
    fontSize: 12,
    color: "#6C757D",
    marginTop: 2,
  },
  darkText: {
    color: "#FFFFFF",
  },
  darkSubtext: {
    color: "#8E8E93",
  },
  clearButton: {
    padding: 8,
  },
  clearButtonActive: {
    backgroundColor: "#FF3B3010",
    borderRadius: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 20, // Ensure messages don't get hidden behind input
  },
  welcomeContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeDescription: {
    fontSize: 16,
    color: "#6C757D",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  quickRepliesContainer: {
    width: "100%",
  },
  quickRepliesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 16,
  },
  quickRepliesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickReplyButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 8,
  },
  quickReplyText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: "flex-end",
  },
  botMessage: {
    alignItems: "flex-start",
  },
  messageCard: {
    maxWidth: width * 0.75,
    padding: 12,
  },
  userMessageCard: {
    backgroundColor: "#007AFF",
  },
  botMessageCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  botMessageText: {
    color: "#333333",
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  userMessageTime: {
    color: "#FFFFFF",
    opacity: 0.7,
  },
  botMessageTime: {
    color: "#6C757D",
  },
  loadingContainer: {
    alignItems: "flex-start",
    marginBottom: 16,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 16,
    color: "#333333",
    marginRight: 12,
    fontWeight: "600",
  },
  darkTypingText: {
    color: "#FFFFFF",
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
    marginHorizontal: 3,
  },
  darkTypingDot: {
    backgroundColor: "#0A84FF",
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === "ios" ? 30 : 16, // Extra padding to stay above tab bar
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
  },
  darkInputContainer: {
    backgroundColor: "#1C1C1E",
    borderTopColor: "#2C2C2E",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F8F9FA",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  darkInputWrapper: {
    backgroundColor: "#2C2C2E",
    borderColor: "#3A3A3C",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    maxHeight: 100,
    paddingVertical: 8,
  },
  darkTextInput: {
    color: "#FFFFFF",
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#E5E5E5",
  },
});

export default ChatbotScreen;
