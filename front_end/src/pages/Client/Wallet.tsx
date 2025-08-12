import React, { useEffect, useState } from "react";
import axios from "axios";

type Tab = "balance" | "add" | "withdraw" | "history" | "refund";

type Transaction = {
  _id?: string;
  type: "add" | "withdraw" | "refund";  // Thêm refund
  amount: number;
  date: string;
  status?: "completed" | "failed";
  note?: string; // Thêm ghi chú
};

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("balance");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (tab === "balance") {
      fetchWallet();
    }
  }, [tab]);

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

  useEffect(() => {
    if (tab === "history") {
      fetchHistory();
    }
  }, [tab]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    setError(null);
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
      setHistory(res.data.history);
    } catch {
      setError("Lỗi khi lấy lịch sử giao dịch");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ");
      return;
    }
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Bạn chưa đăng nhập");
        setLoading(false);
        return;
      }

      const url =
        tab === "add"
          ? "http://localhost:3000/api/wallet/add"
          : tab === "withdraw"
            ? "http://localhost:3000/api/wallet/withdraw"
            : "http://localhost:3000/api/wallet/refund";

      const res = await axios.post(
        url,
        { amount: numAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBalance(res.data.wallet);
      setMessage(res.data.message);
      setAmount("");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Ví của bạn</h1>

      {/* Menu */}
      <div className="flex justify-center mb-6 space-x-4 border-b border-gray-300">
        <button
          className={`pb-2 px-4 font-semibold ${tab === "balance"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-600 hover:text-green-600"
            }`}
          onClick={() => {
            setTab("balance");
            setError(null);
            setMessage(null);
          }}
        >
          Số dư
        </button>
       
        <button
          className={`pb-2 px-4 font-semibold ${tab === "history"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-600 hover:text-green-600"
            }`}
          onClick={() => {
            setTab("history");
            setError(null);
            setMessage(null);
          }}
        >
          Lịch sử
        </button>
      </div>

      {/* Nội dung theo tab */}
      {error && (
        <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded">{error}</p>
      )}
      {message && (
        <p className="mb-4 text-center text-green-600 bg-green-100 p-3 rounded">{message}</p>
      )}

      {tab === "balance" && (
        <div className="text-center">
          {balance !== null ? (
            <>
              <p className="text-xl text-gray-600 mb-2">Số dư hiện tại</p>
              <p className="text-5xl font-extrabold text-green-600">
                {balance.toLocaleString()} <span className="text-2xl">VNĐ</span>
              </p>
            </>
          ) : (
            <p className="text-gray-500">Đang tải...</p>
          )}
        </div>
      )}

      {(tab === "add" || tab === "withdraw" || tab === "refund") && (
        <div className="max-w-sm mx-auto">
          <label
            htmlFor="amount"
            className="block mb-2 font-semibold text-gray-700"
          >
            Nhập số tiền
          </label>
          <input
            type="number"
            id="amount"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nhập số tiền (VNĐ)"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 disabled:bg-green-300 transition"
          >
            {loading ? "Đang xử lý..." : tab === "add" ? "Nạp tiền" : tab === "withdraw" ? "Rút tiền" : "Hoàn tiền"}
          </button>
        </div>
      )}

      {tab === "history" && (
        <div className="max-w-3xl mx-auto">
          {loadingHistory ? (
            <p className="text-center text-gray-500">Đang tải lịch sử...</p>
          ) : history.length === 0 ? (
            <p className="text-center text-gray-500">Chưa có giao dịch nào</p>
          ) : (
            <table className="w-full border border-gray-300 rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border-b border-gray-300 text-left">Loại</th>
                   <th className="p-3 border-b border-gray-300 text-left">Ghi chú</th> {/* Cột mới */}
                  <th className="p-3 border-b border-gray-300 text-right">Số tiền (VNĐ)</th>
                    <th className="p-3 border-b border-gray-300 text-left">Thời gian</th>
                  <th className="p-3 border-b border-gray-300 text-left">Trạng thái</th>
                
                 
                </tr>
              </thead>
              <tbody>
                {history.map((tx, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-300 ${tx.type === "add"
                        ? "text-green-600"
                        : tx.type === "withdraw"
                          ? "text-red-600"
                          : tx.type === "refund"
                            ? "text-blue-600"
                            : ""
                      }`}
                  >
                    <td className="p-3 capitalize">
                      {tx.type === "add"
                        ? "Nạp tiền"
                        : tx.type === "withdraw"
                          ? "Thanh toán đơn hàng"
                          : tx.type === "refund"
                            ? "Hoàn tiền"
                            : "Không xác định"}
                    </td>
                      <td className="p-3">{tx.note || "-"}</td> {/* Hiển thị ghi chú hoặc "-" nếu không có */}
                    <td className="p-3 text-right">{tx.amount.toLocaleString()}</td>
                    <td className="p-3">{new Date(tx.date).toLocaleString()}</td>
                    <td className="p-3 capitalize">
                      {tx.status === "completed" ? (
                        <span className="text-green-600 font-semibold">Thành công</span>
                      ) : tx.status === "failed" ? (
                        <span className="text-red-600 font-semibold">Thất bại</span>
                      ) : (
                        "Chưa xác định"
                      )}
                    </td>
                  
                  </tr>
                ))}
              </tbody>
            </table>

          )}
        </div>
      )}
    </div>
  );
};

export default Wallet;
