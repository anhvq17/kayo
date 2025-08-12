import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Transaction = {
  _id?: string;
  type: "withdraw" | "refund";
  amount: number;
  date: string;
  status?: "completed" | "failed";
  note?: string;
};

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message] = useState<string | null>(null);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<Transaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    fetchWallet();
    fetchHistory();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [filterDate, filterType, history]);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Bạn chưa đăng nhập");
        return;
      }
      const res = await axios.get("http://localhost:3000/api/wallet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(res.data.wallet);
      setError(null);
    } catch {
      setError("Lỗi khi lấy dữ liệu ví");
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Bạn chưa đăng nhập");
        setLoadingHistory(false);
        return;
      }
      const res = await axios.get("http://localhost:3000/api/wallet/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.history.filter(
        (tx: Transaction) => tx.type === "withdraw" || tx.type === "refund"
      );
      setHistory(filtered);
    } catch {
      setError("Lỗi khi lấy lịch sử giao dịch");
    } finally {
      setLoadingHistory(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...history];
    if (filterDate) {
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.date).toISOString().split("T")[0];
        return txDate === filterDate;
      });
    }
    if (filterType !== "all") {
      filtered = filtered.filter(tx => tx.type === filterType);
    }
    setFilteredHistory(filtered);
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentTransactions = filteredHistory.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500 hover:text-gray-900">
          Trang chủ
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Ví của tôi</span>
      </div>

      {error && (
        <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">
          {error}
        </p>
      )}
      {message && (
        <p className="mb-4 text-center text-green-600 bg-green-100 p-3 rounded-lg">
          {message}
        </p>
      )}

      <div className="bg-white text-[#5f518e] mb-8 text-center max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden">
        <div className="bg-white text-[#5f518e] mb-1 text-center max-w-5xl mx-auto rounded-t-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#696faa] to-[#5f518e] text-white px-6 py-8 rounded-t-lg flex justify-between items-center">
            <div className="text-left">
              <p className="text-base">Số dư khả dụng</p>
              <p className="text-5xl font-extrabold mt-1">
                {balance !== null ? balance.toLocaleString() : "Đang tải..."}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2 text-sm text-white/90 max-w-xs">
              <div className="flex items-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17v-6a3 3 0 0 1 6 0v6"
                  />
                  <rect width="12" height="8" x="6" y="13" rx="2" ry="2" />
                </svg>
                <span>Tổng số giao dịch: {history.length}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  Giao dịch thành công:{" "}
                  {history.filter((tx) => tx.status === "completed").length}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>
                  Giao dịch thất bại:{" "}
                  {history.filter((tx) => tx.status === "failed").length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-4 py-4 text-left">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Lịch sử giao dịch</h2>
          <div className="flex space-x-2">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700"
              placeholder="Chọn ngày"
            />
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none px-4 py-1 pr-10 rounded border border-gray-300 bg-white text-gray-700 text-sm"
              >
                <option value="all">Tất cả</option>
                <option value="withdraw">Thanh toán</option>
                <option value="refund">Hoàn tiền</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {loadingHistory ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : filteredHistory.length === 0 ? (
          <p className="text-center mb-9 text-gray-500">Chưa có giao dịch nào</p>
        ) : (
          <>
            <div className="space-y-2 px-4">
              {currentTransactions.map((tx, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[140px_1fr_140px] bg-gray-50 p-4 rounded-lg border items-center"
                >
                  <div className="text-left">
                    <p className="font-medium text-lg">
                      {tx.type === "withdraw" ? "Thanh toán" : "Hoàn tiền"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.date).toLocaleTimeString()} -{" "}
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-center text-base text-gray-600">
                    {tx.note ||
                      `${
                        tx.type === "withdraw"
                          ? "Thanh toán đơn hàng"
                          : "Hoàn tiền đơn hàng"
                      } #1231...`}
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-semibold text-lg ${
                        tx.type === "withdraw" ? "text-red-600" : "text-blue-600"
                      }`}
                    >
                      {tx.type === "withdraw" ? "-" : "+"}
                      {tx.amount.toLocaleString()}
                    </p>
                    <p
                      className={`text-sm ${
                        tx.status === "completed"
                          ? "text-green-600"
                          : tx.status === "failed"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {tx.status === "completed"
                        ? "Thành công"
                        : tx.status === "failed"
                        ? "Thất bại"
                        : "Chưa xác định"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center space-x-4 py-6">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`w-7 h-7 flex justify-center items-center text-lg rounded border ${
                  currentPage === 1
                    ? "border-gray-300 text-gray-300 cursor-not-allowed"
                    : "border-[#5f518e] text-[#5f518e] hover:bg-[#5f518e] hover:text-white"
                }`}
              >
                &lt;
              </button>
              <span>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`w-7 h-7 flex justify-center items-center text-lg rounded border ${
                  currentPage === totalPages
                    ? "border-gray-300 text-gray-300 cursor-not-allowed"
                    : "border-[#5f518e] text-[#5f518e] hover:bg-[#5f518e] hover:text-white"
                }`}
              >
                &gt;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wallet;