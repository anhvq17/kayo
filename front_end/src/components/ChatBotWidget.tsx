import { useState, useEffect, useRef } from "react";
import "./ChatbotWidget.css";
import { MessageOutlined } from "@ant-design/icons";
import { marked } from "marked";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isOpen]);

  const sendMessage = async () => {
    if (!message.trim() || isSending) return;

    const currentMessage = message.trim();

    setMessage("");
    setIsSending(true);

    // 1) push user message
    setChat((prev) => [...prev, { role: "user", text: currentMessage }]);

    // 2) push empty bot placeholder (để stream lấp đầy)
    const placeholderIndex = chat.length + 1;
    setChat((prev) => [...prev, { role: "bot", text: "" }]);

    try {
      // Gửi lịch sử để có ngữ cảnh (tùy chọn)
      const history = [...chat, { role: "user", text: currentMessage }];
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const userId = user?._id
      const res = await fetch("http://localhost:3000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentMessage, history, userId }),
      });

      if (!res.ok || !res.body) {
        throw new Error("No stream body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let botResponse = "";
      // Hiển thị typing indicator trong lúc stream
      let typingShown = true;
      setChat((prev) =>
        prev.map((m, i) =>
          i === placeholderIndex ? { ...m, text: "..." } : m
        )
      );

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        botResponse += chunk;

        // Lần đầu có nội dung, bỏ typing indicator
        if (typingShown) {
          typingShown = false;
          setChat((prev) =>
            prev.map((m, i) =>
              i === placeholderIndex ? { ...m, text: chunk } : m
            )
          );
        } else {
          setChat((prev) =>
            prev.map((m, i) =>
              i === placeholderIndex ? { ...m, text: botResponse } : m
            )
          );
        }
      }

      // đảm bảo có nội dung cuối
      setChat((prev) =>
        prev.map((m, i) =>
          i === placeholderIndex ? { ...m, text: botResponse.trim() } : m
        )
      );
    } catch (err) {
      console.error("Stream error:", err);
      setChat((prev) =>
        prev.map((m, i) =>
          i === placeholderIndex
            ? { role: "bot", text: "❌ Lỗi kết nối chatbot, vui lòng thử lại." }
            : m
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>
              <MessageOutlined /> Chat với Shop
            </span>
            <button onClick={() => setIsOpen(false)}>✖</button>

          </div>

          <div className="chat-body">
            {chat.map((c, i) => (
              <div key={i} className={`chat-message ${c.role}`}>
                {c.role === "bot" ? (
                  c.text === "..."
                    ? (
                      <div className="typing-indicator">
                        <span>Bot đang trả lời</span>
                        <div className="dot" /><div className="dot" /><div className="dot" />
                      </div>
                    ) : (
                      // render markdown cho bot
                      <div
                        className="markdown"
                        dangerouslySetInnerHTML={{ __html: marked.parse(c.text) as string }}
                      />
                    )
                ) : (
                  c.text
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={isSending}
            />
            <button onClick={sendMessage} disabled={isSending}>
              {isSending ? "Đang gửi..." : "Gửi"}
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          <MessageOutlined />
        </button>
      )}
    </div>
  );
}