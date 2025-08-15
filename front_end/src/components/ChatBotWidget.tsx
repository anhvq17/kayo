import { useState } from "react";
import axios, { type AxiosResponse } from "axios";
import "./ChatbotWidget.css";
import { MessageOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons';

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

interface ChatbotResponse {
  reply: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<ChatMessage[]>([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setChat((prev) => [...prev, { role: "user", text: message }]);
    const currentMessage = message;
    setMessage("");

    try {
      const res: AxiosResponse<ChatbotResponse> = await axios.post(
        "http://localhost:3000/api/chatbot",
        { message: currentMessage },
        { headers: { "Content-Type": "application/json" } }
      );

      setChat((prev) => [...prev, { role: "bot", text: res.data.reply }]);
    } catch (err) {
      console.error("Lỗi khi gọi API chatbot:", err);
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "Lỗi kết nối chatbot, vui lòng thử lại." },
      ]);
    }
  };

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span><MessageOutlined/> Chat với Sevend</span>
            <button onClick={() => setIsOpen(false)}><CloseOutlined /></button>
          </div>
          <div className="chat-body">
            {chat.map((c, i) => (
              <div key={i} className={`chat-message ${c.role}`}>
                {c.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}><SendOutlined /></button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          <MessageOutlined/>
        </button>
      )}
    </div>
  );
}