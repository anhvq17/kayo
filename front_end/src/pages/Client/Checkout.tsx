import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { type Province, type District, type Ward } from "sub-vn";
import AddressSelector from "../../components/AddressSelector";
import axios from "axios";
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from "sub-vn";

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
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [userVouchers, setUserVouchers] = useState<any[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [voucherError, setVoucherError] = useState<string>("");
  const [discount, setDiscount] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [userAddress, setUserAddress] = useState<string>("");

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee - discount;

  const parseAddressFromString = (addressString: string) => {
    if (!addressString) return null;

    const provinces = getProvinces();

    const province = provinces.find(p =>
      addressString.includes(p.name) ||
      addressString.includes(p.name.replace(/^(Tỉnh|Thành phố)\s*/, ""))
    );

    if (!province) return null;

    const districts = getDistrictsByProvinceCode(province.code);

    const district = districts.find(d =>
      addressString.includes(d.name) ||
      addressString.includes(d.name.replace(/^(Quận|Huyện|Thị xã)\s*/, ""))
    );

    if (!district) return null;

    const wards = getWardsByDistrictCode(district.code);

    const ward = wards.find(w =>
      addressString.includes(w.name) ||
      addressString.includes(w.name.replace(/^(Phường|Xã|Thị trấn)\s*/, ""))
    );

    if (!ward) return null;

    const addressParts = addressString.split(',');
    const detail = addressParts[0]?.trim() || "";

    return {
      province,
      district,
      ward,
      detail
    };
  };

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
      setUserAddress(parsedUser.address || "");

      if (parsedUser.address) {
        const parsedAddress = parseAddressFromString(parsedUser.address);
        if (parsedAddress) {
          setAddress({
            province: parsedAddress.province,
            district: parsedAddress.district,
            ward: parsedAddress.ward
          });
          setDetailAddress(parsedAddress.detail);
        }
      }
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

  // Fetch user vouchers when userInfo is available
  useEffect(() => {
    if (userInfo?._id) {
      fetchUserVouchers();
    }
  }, [userInfo]);

  useEffect(() => {
    if (!selectedVoucher) {
      setVoucherError("");
      setDiscount(0);
      return;
    }
    const now = new Date();
    const start = new Date(selectedVoucher.startDate);
    const end = new Date(selectedVoucher.endDate);

    if (selectedVoucher.status !== "activated") {
      setVoucherError("Mã giảm giá không hoạt động");
      setDiscount(0);
      return;
    }
    if (now < start) {
      setVoucherError("Mã giảm giá chưa đến ngày sử dụng");
      setDiscount(0);
      return;
    }
    if (now > end) {
      setVoucherError("Mã giảm giá đã hết hạn");
      setDiscount(0);
      return;
    }
    if (selectedVoucher.usageLimit && selectedVoucher.usedCount >= selectedVoucher.usageLimit) {
      setVoucherError("Mã giảm giá đã hết lượt sử dụng");
      setDiscount(0);
      return;
    }
    if (subtotal < (selectedVoucher.minOrderValue || 0)) {
      setVoucherError(`Đơn hàng phải từ ${(selectedVoucher.minOrderValue || 0).toLocaleString()} để dùng mã này`);
      setDiscount(0);
      return;
    }
    setVoucherError("");
    let d = 0;
    if (selectedVoucher.discountType === "percent") {
      d = Math.round(subtotal * (selectedVoucher.discountValue / 100));
      if (selectedVoucher.maxDiscountValue) {
        d = Math.min(d, selectedVoucher.maxDiscountValue);
      }
    } else if (selectedVoucher.discountType === "fixed") {
      d = Math.min(selectedVoucher.discountValue, subtotal);
    }
    setDiscount(d);
  }, [selectedVoucher, subtotal]);

  const { province: selectedProvince, district: selectedDistrict, ward: selectedWard } = address;

  const isFormValid = () => {
    if (userAddress && !showAddressForm) {
      return fullName && phone && cartItems.length > 0;
    }
    return fullName && phone && selectedProvince && selectedDistrict && selectedWard && detailAddress && cartItems.length > 0;
  };

  const fetchUserVouchers = async () => {
    if (!userInfo?._id) return;

    try {
      // Trước tiên xóa những voucher hết hạn
      await axios.delete(`http://localhost:3000/voucher-user/remove-expired/${userInfo._id}`);

      // Sau đó lấy danh sách voucher còn hiệu lực
      const res = await axios.get(`http://localhost:3000/voucher-user/saved/${userInfo._id}`);
      setUserVouchers(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy mã giảm giá của user:", error);
      setUserVouchers([]);
    }
  };

  // Function để xóa sản phẩm khỏi cart server một cách an toàn
  const removeFromServerCart = async (userId: string, variantId: string, itemName: string) => {
    try {
      await axios.delete("http://localhost:3000/cart", {
        data: {
          userId,
          variantId,
        },
      });
      console.log(`✅ Đã xóa ${itemName} khỏi giỏ hàng server`);
    } catch (error: any) {
      // Nếu lỗi 404, có thể sản phẩm đã được xóa trước đó
      if (error.response?.status === 404) {
        console.log(`ℹ️ ${itemName} không tồn tại trong giỏ hàng server`);
      } else {
        console.warn(`⚠️ Không thể xóa ${itemName} khỏi giỏ hàng server:`, error.message);
      }
    }
  };

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
      let deliveryAddress;
      if (userAddress && !showAddressForm) {
        deliveryAddress = {
          fullAddress: userAddress,
          province: "",
          district: "",
          ward: "",
          detail: "",
        };
      } else {
        deliveryAddress = {
          province: selectedProvince?.name,
          district: selectedDistrict?.name,
          ward: selectedWard?.name,
          detail: detailAddress,
        };
      }

      const orderPayload = {
        userId: userInfo._id,
        fullName,
        phone,
        address: deliveryAddress,
        items: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variantId: item.variantId,
        })),
        totalAmount: total,
        paymentMethod, // ví, vnpay hoặc cod...
        voucherCode: selectedVoucher ? selectedVoucher.code : undefined,
        discount: discount,
      };

      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Lỗi từ server khi tạo đơn:", errorData);
        alert(errorData.message || JSON.stringify(errorData) || "Tạo đơn hàng thất bại");
        setIsLoading(false);
        return;
      }



      const orderResult = await response.json();
      const orderId = orderResult.orderId;

      if (paymentMethod === "wallet") {
        // Thanh toán ví đã được xử lý trên backend rồi, chỉ cần xoá giỏ hàng và chuyển trang
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const updatedCart = cart.filter(
          (cartItem: any) => !cartItems.some((ordered) => ordered.id === cartItem.id)
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        localStorage.removeItem("buyNowItem");

        if (userInfo && userInfo._id) {
          for (const item of cartItems) {
            if (item.variantId) {
              await removeFromServerCart(userInfo._id, item.variantId, item.name);
            }
          }
        }

        window.location.href = `ordersuccessfully?orderId=${orderId}`;
      } else if (paymentMethod === "vnpay") {
        localStorage.setItem("lastOrderedItems", JSON.stringify(cartItems));
        const paymentRes = await fetch(`http://localhost:3000/payment/create_payment?amount=${total}&orderId=${orderId}`);
        const paymentData = await paymentRes.json();
        window.location.href = paymentData.paymentUrl;
      } else {
        // Xử lý các phương thức thanh toán khác (ví dụ: COD)
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const updatedCart = cart.filter(
          (cartItem: any) => !cartItems.some((ordered) => ordered.id === cartItem.id)
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        localStorage.removeItem("buyNowItem");

        if (userInfo && userInfo._id) {
          for (const item of cartItems) {
            if (item.variantId) {
              await removeFromServerCart(userInfo._id, item.variantId, item.name);
            }
          }
        }
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
                <h3 className="text-base font-bold text-gray-700">Thông tin người nhận</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
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
                <h3 className="text-base font-bold text-gray-700">Địa chỉ giao hàng</h3>

                {!showAddressForm && userAddress && (
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-600 mb-2"><strong>Địa chỉ hiện tại:</strong></p>
                        <p className="text-sm text-gray-800">{userAddress}</p>
                      </div>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="text-sm font-medium text-[#5f518e] hover:text-white hover:bg-[#5f518e] border border-[#5f518e] rounded-full px-3 py-1 transition-colors duration-200"
                      >
                        Thay đổi
                      </button>

                    </div>
                  </div>
                )}

                {showAddressForm && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-l text-gray-600">Chỉnh sửa địa chỉ giao hàng</span>
                      <button
                        onClick={() => {
                          setShowAddressForm(false);
                          if (userAddress) {
                            const parsedAddress = parseAddressFromString(userAddress);
                            if (parsedAddress) {
                              setAddress({
                                province: parsedAddress.province,
                                district: parsedAddress.district,
                                ward: parsedAddress.ward
                              });
                              setDetailAddress(parsedAddress.detail);
                            }
                          }
                        }}
                        className="text-sm font-medium text-[#5f518e] hover:text-white hover:bg-[#5f518e] border border-[#5f518e] rounded-full px-3 py-1 transition-colors duration-200"
                      >
                        Hủy
                      </button>
                    </div>

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
                )}

                {!showAddressForm && !userAddress && (
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
                )}

                {!showAddressForm && !userAddress && detailAddress && selectedWard && selectedDistrict && selectedProvince && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600"><strong>Địa chỉ giao hàng:</strong></p>
                    <p className="text-sm text-gray-800 mt-1">
                      {detailAddress}, {selectedWard.name}, {selectedDistrict.name}, {selectedProvince.name}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-700">Phương thức thanh toán</h3>
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

                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "wallet"}
                      onChange={() => setPaymentMethod("wallet")}
                      className="w-4 h-4"
                    />
                    <div className="ml-3">
                      <span className="text-gray-700 font-medium">Ví điện tử</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Đơn hàng của bạn</h2>

              <div className="flex justify-between mt-2">
                <div className="text-gray-600 flex items-center">
                  <span>Mã giảm giá:</span>
                  {selectedVoucher && !voucherError && (
                    <span className="text-[#5f518e] ml-1 flex items-center gap-1">
                      {selectedVoucher.code}
                      {selectedVoucher.discountType === 'percent'
                        ? ` (-${selectedVoucher.discountValue}%)`
                        : ` (-${discount.toLocaleString("vi-VN")})`}
                    </span>
                  )}
                </div>
                {selectedVoucher ? (
                  <button
                    className="px-2 py-1 text-xs text-red-600 hover:text-white border border-red-400 rounded hover:bg-red-500 transition duration-200"
                    onClick={() => setSelectedVoucher(null)}
                  >
                    Bỏ chọn
                  </button>

                ) : (
                  <button
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium"
                    onClick={() => {
                      setShowVoucherModal(true);
                      fetchUserVouchers();
                    }}
                  >
                    Chọn mã giảm giá
                  </button>
                )}
              </div>

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
                          {(item.price * item.quantity).toLocaleString("vi-VN")}
                        </p>
                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}


                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-600">Tổng tiền hàng</span>
                      <span className="text-gray-800 font-medium">{subtotal.toLocaleString("vi-VN")}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className="text-gray-800 font-medium">Miễn phí</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-600">Giảm giá</span>
                      <span className="text-red-500 font-medium">
                        {selectedVoucher && selectedVoucher.discountType === 'percent'
                          ? `-${discount.toLocaleString("vi-VN")}`
                          : `-${discount.toLocaleString("vi-VN")}`}
                      </span>
                    </div>
                    {selectedVoucher && voucherError && (
                      <div className="text-sm text-red-500 mt-1">{voucherError}</div>
                    )}
                    {selectedVoucher && !voucherError && (
                      <div className="text-sm text-[#5f518e] mt-1">Đã áp dụng mã giảm giá!</div>
                    )}
                  </div>

                  {showVoucherModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
                        <h2 className="text-lg font-semibold mb-4">Chọn mã giảm giá</h2>

                        <button
                          onClick={() => setShowVoucherModal(false)}
                          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                        >
                          &times;
                        </button>

                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {userVouchers.length === 0 ? (
                            <div className="text-gray-500 text-center">Không có mã giảm giá khả dụng</div>
                          ) : (
                            userVouchers.map((voucher) => {
                              const isOutOfUsage = voucher.usageLimit && voucher.usedCount >= voucher.usageLimit;
                              const isInactive = voucher.status === "inactivated";
                              const disabled = isOutOfUsage || isInactive;
                              let statusText = "Kích hoạt";
                              let statusClass = "bg-green-100 text-green-700";
                              if (isOutOfUsage) {
                                statusText = "Hết lượt";
                                statusClass = "bg-gray-200 text-gray-500";
                              } else if (isInactive) {
                                statusText = "Tạm dừng";
                                statusClass = "bg-yellow-100 text-yellow-700";
                              }

                              return (
                                <div
                                  key={voucher._id}
                                  className={`border rounded p-3 flex flex-col gap-1 ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'hover:bg-gray-50 cursor-pointer'}`}
                                  onClick={() => {
                                    if (!disabled) {
                                      setSelectedVoucher(voucher);
                                      setShowVoucherModal(false);
                                    }
                                  }}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <span className="font-semibold text-[#5f518e]">{voucher.code}</span>
                                      <span className="ml-2 text-xs text-red-500 font-semibold">
                                        {voucher.discountType === 'percent'
                                          ? `-${voucher.discountValue}%${voucher.maxDiscountValue ? ` (tối đa ${voucher.maxDiscountValue.toLocaleString()})` : ''}`
                                          : `-${voucher.discountValue.toLocaleString()}`}
                                      </span>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${statusClass}`}>{statusText}</span>
                                  </div>
                                  <div className="text-xs text-gray-600">HSD: {new Date(voucher.startDate).toLocaleDateString()} - {new Date(voucher.endDate).toLocaleDateString()}</div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-red-500">Tổng tiền</span>
                      <span className="text-lg font-bold text-red-500">{total.toLocaleString("vi-VN")}</span>
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