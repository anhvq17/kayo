import { Router } from "express";
import qs from "querystring";
import crypto from "crypto";
import moment from "moment";
import Order from "../models/OrderModel.js";

const paymentRouter = Router();

function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

paymentRouter.get("/create_payment", (req, res) => {
  const { amount, orderId } = req.query;
  const tmnCode = "MN9C23RS";
  const secretKey = "I1PK1BJ22V0MGBZ409P1RTW9TOANTEML";

  const returnUrl = "http://localhost:5173/payment-result";
  const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

  let ipAddr = req.ip;
  let txnRef = orderId ? `${orderId}-${Date.now()}` : moment().format("YYYYMMDDHHmmss");
  let bankCode = req.query.bankCode || "NCB";

  let createDate = moment().format("YYYYMMDDHHmmss");
  let orderInfo = "Thanh_toan_don_hang";
  let locale = req.query.language || "vn";
  let currCode = "VND";

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: txnRef, 
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "billpayment",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let signData = qs.stringify(vnp_Params);
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  let paymentUrl = vnp_Url + "?" + qs.stringify(vnp_Params);
  res.json({ paymentUrl });
});

paymentRouter.get("/check_payment", (req, res) => {
  const query = req.query;
  const secretKey = "I1PK1BJ22V0MGBZ409P1RTW9TOANTEML";
  const vnp_SecureHash = query.vnp_SecureHash;

  delete query.vnp_SecureHash;
  const signData = qs.stringify(query);

  const hmac = crypto.createHmac("sha512", secretKey);
  const checkSum = hmac.update(signData).digest("hex");
  console.log("VNPay response:", query);
  console.log("vnp_TxnRef (orderId):", query.vnp_TxnRef);
  console.log("vnp_ResponseCode:", query.vnp_ResponseCode);

  let originalOrderId = query.vnp_TxnRef ? query.vnp_TxnRef.split("-")[0] : null;

  if (vnp_SecureHash === checkSum) {
    if (query.vnp_ResponseCode === "00") {
      if (originalOrderId) {
        console.log("Attempting to update order with ID:", originalOrderId);
        Order.findByIdAndUpdate(
          originalOrderId,
          { 
            paymentStatus: 'Đã thanh toán',
            totalAmount: 0
          },
          { new: true }
        ).then(updatedOrder => {
          if (updatedOrder) {
            console.log('Order payment status updated successfully:', updatedOrder._id);
            console.log('Updated order details:', {
              _id: updatedOrder._id,
              paymentStatus: updatedOrder.paymentStatus,
              orderStatus: updatedOrder.orderStatus
            });
          } else {
            console.log('Order not found with ID:', originalOrderId);
          }
        }).catch(err => {
          console.error('Error updating order payment status:', err);
        });
      } else {
        console.log('No vnp_TxnRef found in VNPay response');
      }
      
      res.json({ message: "Thanh toán thành công", data: query });
    } else {
      console.log('Payment failed with response code:', query.vnp_ResponseCode);
      res.json({ message: "Thanh toán thất bại", data: query });
    }
  } else {
    console.log('Invalid signature - data tampered');
    res.status(400).json({ message: "Dữ liệu không hợp lệ" });
  }
});

export default paymentRouter;