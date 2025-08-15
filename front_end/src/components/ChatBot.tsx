import { useState } from "react";
import axios, { type AxiosResponse } from "axios";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

interface ChatbotResponse {
  reply: string;
}

export default function Chatbot() {
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const currentMessage = message.trim();
    setChat((prev) => [...prev, { role: "user", text: currentMessage }]);
    setMessage("");
    setLoading(true);

    try {
      // Nếu dùng proxy Vite: '/api/chatbot'
      // Nếu gọi trực tiếp: 'http://localhost:3000/api/chatbot'
      const res: AxiosResponse<ChatbotResponse> = await axios.post(
        "/api/chatbot",
        { message: currentMessage },
        { headers: { "Content-Type": "application/json" } }
      );

      setChat((prev) => [...prev, { role: "bot", text: res.data.reply }]);
    } catch (err) {
      console.error("Lỗi khi gọi API chatbot:", err);
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "❌ Không thể kết nối chatbot, vui lòng thử lại." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ height: 300, overflowY: "auto", border: "1px solid #ccc" }}>
        {chat.map((c, i) => (
          <p key={i}>
            <b>{c.role}:</b> {c.text}
          </p>
        ))}
        {loading && <p><i>Đang soạn trả lời...</i></p>}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nhập tin nhắn..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        disabled={loading}
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? "..." : "Gửi"}
      </button>
    </div>
  );
}
