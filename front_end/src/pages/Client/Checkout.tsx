import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { type Province, type District, type Ward } from "sub-vn";
import AddressSelector from "../../components/AddressSelector";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  volume: string;
  fragrance: string;
  image: {
    src: string;
    width?: number;
    height?: number;
  };
  variantId?: string;
}

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [address, setAddress] = useState<{
    province?: Province;
    district?: District;
    ward?: Ward;
  }>({});
  const [detailAddress, setDetailAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const parseCartItem = (item: any): CartItem => ({
    id: `${item._id || item.variantId}-${item.selectedScent}-${item.selectedVolume}`,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    volume: item.selectedVolume || item.volume || "",
    fragrance: item.selectedScent || item.fragrance || "",
    image: typeof item.image === "string"
      ? { src: item.image, width: 100, height: 100 }
      : item.image,
    variantId: item.variantId || item._id,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo(parsedUser);
      setFullName(parsedUser.username || "");
      setPhone(parsedUser.phone || "");
    }

    const buyNowRaw = localStorage.getItem("buyNowItem");
    if (buyNowRaw) {
      try {
        const item = JSON.parse(buyNowRaw);
        setCartItems([parseCartItem(item)]);
        localStorage.removeItem("buyNowItem");
        return;
      } catch (error) {
        console.error("Lỗi khi parse buyNowItem:", error);
      }
    }

    const checkoutRaw = localStorage.getItem("checkoutItems");
    if (checkoutRaw) {
      try {
        const data = JSON.parse(checkoutRaw);
        const items: CartItem[] = data.map(parseCartItem);
        setCartItems(items);
        localStorage.removeItem("checkoutItems");
      } catch (error) {
        console.error("Lỗi khi parse checkoutItems:", error);
      }
    }
  }, []);

  const { province: selectedProvince, district: selectedDistrict, ward: selectedWard } = address;

  const isFormValid = () => {
    return fullName && phone && selectedProvince && selectedDistrict && selectedWard && detailAddress && cartItems.length > 0;
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = 0;
  const discount = 0;
  const total = subtotal + shippingFee - discount;

  const handleSubmit = async () => {
    if (!isFormValid()) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!userInfo || !userInfo._id) {
      alert("Không tìm thấy thông tin người dùng.");
      return;
    }

    setIsLoading(true);

    try {
      const orderPayload = {
        userId: userInfo._id,
        fullName,
        phone,
        address: {
          province: selectedProvince?.name,
          district: selectedDistrict?.name,
          ward: selectedWard?.name,
          detail: detailAddress,
        },
        items: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variantId: item.variantId,
        })),
        totalAmount: total,
        paymentMethod,
      };

      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error("Tạo đơn hàng thất bại");
      }

      const orderResult = await response.json();
      const orderId = orderResult.orderId;

      if (paymentMethod === "vnpay") {
        const paymentRes = await fetch(`http://localhost:3000/payment/create_payment?amount=${total}&orderId=${orderId}`);
        const paymentData = await paymentRes.json();
        window.location.href = paymentData.paymentUrl;
      } else {
        localStorage.removeItem("cart");
        localStorage.removeItem("buyNowItem");
        window.location.href = `ordersuccessfully?orderId=${orderId}`;
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("Có lỗi xảy ra khi đặt hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/cart" className="text-gray-500 hover:text-gray-900">Giỏ hàng</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Thanh toán</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Thông tin giao hàng</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-700">Thông tin người nhận</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ tên"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-700">Địa chỉ giao hàng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỉnh/Thành phố, Quận/Huyện, Phường/Xã <span className="text-red-500">*</span>
                    </label>
                    <AddressSelector value={address} onChange={setAddress} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ chi tiết <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={detailAddress}
                      onChange={(e) => setDetailAddress(e.target.value)}
                      placeholder="Tên đường, Toà nhà, Số nhà."
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {detailAddress && selectedWard && selectedDistrict && selectedProvince && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600"><strong>Địa chỉ giao hàng:</strong></p>
                    <p className="text-sm text-gray-800 mt-1">
                      {detailAddress}, {selectedWard.name}, {selectedDistrict.name}, {selectedProvince.name}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-700">Phương thức thanh toán</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-4 h-4"
                    />
                    <div className="ml-3">
                      <span className="text-gray-700 font-medium">Thanh toán khi nhận hàng (COD)</span>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "vnpay"}
                      onChange={() => setPaymentMethod("vnpay")}
                      className="w-4 h-4"
                    />
                    <div className="ml-3">
                      <span className="text-gray-700 font-medium">Thanh toán online (VNPAY)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Đơn hàng */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Đơn hàng của bạn</h2>
            </div>
            <div className="p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-7">Giỏ hàng trống</p>
                  <Link to="/" className="inline-block px-4 py-2 bg-[#5f518e] text-white rounded-md">
                    Tiếp tục mua sắm
                  </Link>
                </div>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image.src}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 text-sm">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-500">Hương vị: {item.fragrance}</p>
                        <p className="text-sm text-gray-500">Dung tích: {item.volume}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-semibold text-gray-800">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                        </p>
                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tạm tính</span>
                      <span className="text-gray-800 font-medium">{subtotal.toLocaleString("vi-VN")}₫</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className="text-gray-800 font-medium">Miễn phí</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá</span>
                      <span className="text-gray-800 font-medium">{discount.toLocaleString("vi-VN")}₫</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-red-500">Tổng tiền</span>
                      <span className="text-lg font-bold text-red-500">{total.toLocaleString("vi-VN")}₫</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid() || isLoading}
                    className="w-full bg-[#5f518e] hover:bg-[#5f518e] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg"
                  >
                    {isLoading ? "Đang xử lý..." : "Đặt hàng"}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-2">
                    Bằng việc nhấn nút đặt hàng, bạn đồng ý với{" "} <br />
                    <Link to="#" className="text-[#5f518e] underline">Điều khoản</Link> và{" "}
                    <Link to="#" className="text-[#5f518e] underline">Chính sách</Link>{" "}của chúng tôi.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
