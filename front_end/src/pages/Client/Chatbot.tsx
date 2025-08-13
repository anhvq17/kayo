import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Faq = {
  _id: string;
  question: string;
  answer: string;
};

const FaqList: React.FC = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/faqs");
        setFaqs(res.data.faqs);
      } catch (err) {
        setFaqs([]);
      }
    };
    fetchFaqs();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">FAQ</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-center">NHỮNG CÂU HỎI THƯỜNG GẶP</h1>

      {faqs.length === 0 && (
        <p className="text-center text-gray-500">Chưa có câu hỏi nào.</p>
      )}

      <div className="space-y-2">
        {faqs.map((faq) => (
          <div
            key={faq._id}
            className="border border-gray-300 max-w-3xl mx-auto"
          >
            <button
              className="w-full max-w-3xl mx-auto px-4 py-3 text-lg hover:bg-[#5f518e] hover:text-white flex justify-between items-center"
              onClick={() => toggleExpand(faq._id)}
            >
              <span className="flex-1">{faq.question}</span>
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  expandedId === faq._id ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedId === faq._id && (
              <div className="px-4 py-3 bg-gray-50 text-gray-700 border-t border-gray-300 rounded-b-lg">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqList;