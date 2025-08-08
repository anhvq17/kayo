import React, { useEffect, useState } from "react";
import axios from "axios";

type Tab = "balance" | "add" | "withdraw";

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("balance");
  const [amount, setAmount] = useState<string>(""); // dùng cho nạp/rút
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Lấy số dư
  useEffect(() => {
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
    fetchWallet();
  }, []);

  // Xử lý nạp hoặc rút tiền
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
          : "http://localhost:3000/api/wallet/withdraw";

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
          className={`pb-2 px-4 font-semibold ${
            tab === "balance"
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
          className={`pb-2 px-4 font-semibold ${
            tab === "add"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-600 hover:text-green-600"
          }`}
          onClick={() => {
            setTab("add");
            setError(null);
            setMessage(null);
          }}
        >
          Nạp tiền
        </button>
        <button
          className={`pb-2 px-4 font-semibold ${
            tab === "withdraw"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-600 hover:text-green-600"
          }`}
          onClick={() => {
            setTab("withdraw");
            setError(null);
            setMessage(null);
          }}
        >
          Rút tiền
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

      {(tab === "add" || tab === "withdraw") && (
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
            {loading ? "Đang xử lý..." : tab === "add" ? "Nạp tiền" : "Rút tiền"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Wallet;
