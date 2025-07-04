import { Button, Result } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

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
          setTitle("Thanh toán thành công");
          // Extract orderId from transaction reference
          if (data.data.vnp_TxnRef) {
            setOrderId(data.data.vnp_TxnRef);
          }
        } else if (data.data.vnp_ResponseCode == "24") {
          setStatus("error");
          setTitle("Khách hàng hủy thanh toán");
        } else {
          setStatus("error");
          setTitle(`Thanh toán thất bại (Mã lỗi: ${data.data.vnp_ResponseCode})`);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra thanh toán VNPAY:", error);
        setStatus("error");
        setTitle("Có lỗi xảy ra trong quá trình kiểm tra thanh toán.");
      }
    })();
  }, [searchParams]);

  return (
    <div>
      <Result
        status={status}
        title={title}
        subTitle={
          status === "success" && orderId 
            ? `Mã đơn hàng: ${orderId}. Vui lòng kiểm tra lại trạng thái đơn hàng của bạn.`
            : "Vui lòng kiểm tra lại trạng thái đơn hàng của bạn."
        }
        extra={[
          <Button type="primary" key="home" href="/"> 
            Quay về Trang chủ
          </Button>,
          <Button key="orders" href="/orders">
            Xem Đơn hàng của tôi
          </Button>,
        ]}
      />
    </div>
  );
}

export default CheckPayment;