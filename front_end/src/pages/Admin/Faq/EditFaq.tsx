import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Faq {
  _id: string;
  question: string;
  answer: string;
}

const EditFaq: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [faq, setFaq] = useState<Faq | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:3000/api/faqs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy câu hỏi");
        return res.json();
      })
      .then((data) => {
        setFaq(data);
        setQuestion(data.question);
        setAnswer(data.answer);
      })
      .catch(() => setError("Không tìm thấy câu hỏi hoặc lỗi tải dữ liệu"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setError("Vui lòng nhập đầy đủ câu hỏi và câu trả lời");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/faqs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ question, answer }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Lỗi khi cập nhật câu hỏi");
      }

      alert("Cập nhật câu hỏi thành công!");
      navigate('/admin/faqs');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !faq) return <p>Đang tải...</p>;
  if (error && !faq) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Chỉnh sửa câu hỏi</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit}>
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
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>
      </form>
    </div>
  );
};

export default EditFaq;