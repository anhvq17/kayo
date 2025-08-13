import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit, Plus, Trash } from "lucide-react";

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
            fetchFaqs();
        } catch (err: any) {
            setError(err.response?.data?.message || "Lỗi khi xóa câu hỏi");
        } finally {
            setLoading(false);
        }
    };

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Danh sách câu hỏi</h1>
          <Link to="/admin/addfaqs">
            <button className="w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center">
              <Plus size={14} />
            </button>
          </Link>
        </div>

          {error && <p className="mb-4 text-red-600">{error}</p>}
          {message && <p className="mb-4 text-green-600">{message}</p>}
          {loading && <p>Đang tải danh sách FAQ...</p>}

          {!loading && faqs.length === 0 && (
            <p className="text-center py-10 text-gray-500">Chưa có câu hỏi nào.</p>
          )}

          {!loading && faqs.length > 0 && (
            <table className="min-w-full bg-white border text-sm">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-4 py-2">STT</th>
                  <th className="px-4 py-2">Câu hỏi</th>
                  <th className="px-4 py-2 max-w-[300px]">Câu trả lời</th>
                  <th className="px-4 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq, index) => (
                  <tr key={faq._id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{faq.question}</td>
                    <td className="px-4 py-2 max-w-[300px] break-words whitespace-normal">{faq.answer}</td>
                    <td className="px-4 py-2">
                    <div className="inline-flex space-x-1 justify-center">
                      <button
                        onClick={() => navigate(`/admin/faqs/${faq._id}`)}
                        className="w-8 h-8 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(faq._id)}
                        className="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                      >
                        <Trash size={14} />
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