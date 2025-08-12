import { useState } from "react";
import axios from "axios";

const AddFaq = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    if (!question.trim() || !answer.trim()) {
      setError("Vui lòng nhập đầy đủ câu hỏi và câu trả lời");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
     
      await axios.post(
        "http://localhost:3000/api/faqs",
        { question, answer },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Thêm câu hỏi thành công!");
      setQuestion("");
      setAnswer("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi thêm câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Thêm câu hỏi mới</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <input
        type="text"
        placeholder="Câu hỏi"
        className="w-full p-2 border border-gray-300 rounded mb-4"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={loading}
      />
      <textarea
        placeholder="Câu trả lời"
        className="w-full p-2 border border-gray-300 rounded mb-4"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={4}
        disabled={loading}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Đang thêm mới..." : "Thêm mới"}
      </button>
    </div>
  );
};

export default AddFaq;