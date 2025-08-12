import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-semibold mb-6 text-center">Câu hỏi thường gặp</h1>

      {faqs.length === 0 && (
        <p className="text-center text-gray-500">Chưa có câu hỏi nào.</p>
      )}

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq._id}
            className="border border-gray-300 rounded-lg shadow-sm"
          >
            <button
              className="w-full px-4 py-3 text-left font-medium text-lg text-purple-700 hover:bg-purple-50 rounded-lg flex justify-between items-center"
              onClick={() => toggleExpand(faq._id)}
            >
              <span>{faq.question}</span>
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
