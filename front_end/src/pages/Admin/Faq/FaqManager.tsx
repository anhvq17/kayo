import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Faq {
    _id: string;
    question: string;
    answer: string;
}

const FaqManager: React.FC = () => {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Load FAQ từ API
    const fetchFaqs = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get("http://localhost:3000/api/faqs");
            setFaqs(res.data.faqs);
        } catch (err) {
            setError("Lỗi khi tải danh sách FAQ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    // Xóa FAQ
    const handleDelete = async (id: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3000/api/faqs/${id}`, {
                headers: {
                    Authorization: `Bearer ${token || ""}`,
                },
            });
            setMessage("Xóa câu hỏi thành công!");
            // Load lại danh sách FAQ
            fetchFaqs();
        } catch (err: any) {
            setError(err.response?.data?.message || "Lỗi khi xóa câu hỏi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-semibold">Quản lý FAQ</h1>
                <button
                    onClick={() => navigate("/admin/addfaqs")}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    disabled={loading}
                >
                    Thêm câu hỏi mới
                </button>
            </div>

            {error && <p className="mb-4 text-red-600">{error}</p>}
            {message && <p className="mb-4 text-green-600">{message}</p>}
            {loading && <p>Đang tải danh sách FAQ...</p>}

            {!loading && faqs.length === 0 && (
                <p className="text-center py-10 text-gray-500">Chưa có câu hỏi nào.</p>
            )}

            {!loading && faqs.length > 0 && (
                <table className="w-full border-collapse">
  <thead>
    <tr className="bg-black text-white font-bold">
      <th className="p-2 text-left">STT</th>
      <th className="p-2 text-left">Câu hỏi</th>
      <th className="p-2 text-left">Câu trả lời</th>
      <th className="p-2 text-center">Hành động</th>
    </tr>
  </thead>
  <tbody>
    {faqs.map((faq, index) => (
      <tr key={faq._id} className="bg-white hover:bg-gray-50">
        <td className="p-2">{index + 1}</td>
        <td className="p-2">{faq.question}</td>
        <td className="p-2">{faq.answer}</td>
       <td className="p-2 text-center">
  <div className="inline-flex space-x-2 justify-center">
    <button
      onClick={() => navigate(`/admin/faqs/${faq._id}`)}
      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Sửa
    </button>
    <button
      onClick={() => handleDelete(faq._id)}
      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Xóa
    </button>
  </div>
</td>
      </tr>
    ))}
  </tbody>
</table>
            )}
        </div>
    );
};

export default FaqManager;
