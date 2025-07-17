import { Button, Result } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function CheckPayment() {
  const searchParams = new URLSearchParams(useLocation().search);

  const [status, setStatus] = useState<"success" | "error">("error");
  const [title, setTitle] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/payment/check_payment?${searchParams.toString()}`
        );

        if (data.data.vnp_ResponseCode == "00") {
          setStatus("success");
          setTitle("Thanh toán thành công!");
          localStorage.removeItem('cart');
          if (data.data.vnp_TxnRef) {
            setOrderId(data.data.vnp_TxnRef);
          }
        } else if (data.data.vnp_ResponseCode == "24") {
          setStatus("error");
          setTitle("Khách hàng hủy thanh toán");
        } else {
          setStatus("error");
          setTitle(`Thanh toán thất bại (Mã lỗi: ${data.data.vnp_ResponseCode})!`);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra thanh toán VNPAY:", error);
        setStatus("error");
        setTitle("Có lỗi xảy ra trong quá trình kiểm tra thanh toán.");
      }
    })();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center px-4 mt-24 mb-24">
      <Result
        status={status}
        title={title}
        className="text-gray-500 text-base text-center max-w-md mb-4"
        subTitle={
          status === "success" && orderId 
            ? `Mã đơn hàng: ${orderId}. Vui lòng kiểm tra lại trạng thái đơn hàng của bạn.`
            : "Vui lòng kiểm tra lại trạng thái đơn hàng của bạn."
        }
        extra={[
          <Button className="bg-[#6B5CA5] text-white px-4 py-2 rounded font-semibold hover:opacity-90" key="home" href="/"> 
            Tiếp tục mua sắm
          </Button>,
          <Button className="bg-[#6B5CA5] text-white px-4 py-2 rounded font-semibold hover:opacity-90" key="orders" href="/orders">
            Theo dõi đơn hàng
          </Button>
        ]}
      />
    </div>
  );
}

export default CheckPayment;