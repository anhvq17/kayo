import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, X } from "lucide-react";
import axios from "axios";

interface CartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  volume: string;
  fragrance?: string;
  variantId?: string;
  selectedScent?: string;
  selectedVolume?: string;
  image: {
    src: string;
    width?: number;
    height?: number;
  };
  id: string;
}

interface UserInfoType {
  _id: string;
  username: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [user, setUserInfo] = useState<UserInfoType | null>(null);
  const navigate = useNavigate();

  const saveToLocalStorage = (items: CartItem[]) => {
    const formatted = items.map((item) => ({
      _id: item._id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      selectedVolume: item.volume,
      selectedScent: item.fragrance,
      variantId: item.variantId,
      image: item.image.src,
    }));
    localStorage.setItem("cart", JSON.stringify(formatted));
  };

  const syncCartAfterLogin = async (userId: string) => {
    try {
      const res = await axios.get(`http://localhost:3000/cart/user/${userId}`);
      const serverCart = res.data.cart;

      // Ghi đè giỏ hàng local bằng giỏ hàng từ server
      localStorage.setItem("cart", JSON.stringify(serverCart));

      setCartItems(
        serverCart.map((item: any) => {
          const imageSrc =
            typeof item.image === "string"
              ? item.image
              : item.image?.src || "/img/default.jpg";

          return {
            ...item,
            id:
              item.variantId ||
              `${item.productId}-${item.selectedScent}-${item.selectedVolume}`,
            volume: item.selectedVolume || item.volume,
            fragrance: item.selectedScent || item.fragrance,
            image: {
              src: imageSrc,
              width: 100,
              height: 100,
            },
          };
        })
      );
    } catch (err) {
      console.error("❌ Lỗi khi đồng bộ giỏ hàng:", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserInfo(parsed);
        if (parsed._id) {
          syncCartAfterLogin(parsed._id);
        }
      } catch (err) {
        console.error("Lỗi parse user:", err);
      }
    } else {
      const raw = localStorage.getItem("cart");
      if (raw) {
        try {
          const cartData = JSON.parse(raw);
          const items: CartItem[] = cartData.map((item: any) => {
            const variantId =
              item.variantId ||
              `${item.productId}-${item.selectedScent}-${item.selectedVolume}`;
            const imageSrc =
              typeof item.image === "string"
                ? item.image
                : item.image?.src || "/img/default.jpg";
            return {
              _id: item._id || item.productId,
              productId: item.productId || item._id,
              id: variantId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              volume: item.selectedVolume,
              fragrance: item.selectedScent,
              variantId: variantId,
              image: {
                src: imageSrc,
                width: 100,
                height: 100,
              },
            };
          });
          setCartItems(items);
        } catch (error) {
          console.error("Lỗi khi parse localStorage:", error);
        }
      }
    }
  }, []);

  const updateQuantity = async (id: string, newQuantity: number) => {
    const targetItem = cartItems.find((item) => item.id === id);
    if (!targetItem) return;

    if (newQuantity < 1) {
      if (window.confirm("Bạn có muốn xoá sản phẩm này khỏi giỏ hàng?")) {
        const updated = cartItems.filter((item) => item.id !== id);
        setCartItems(updated);
        saveToLocalStorage(updated);
        setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));

        if (user?._id && targetItem.variantId) {
          await axios.delete("http://localhost:3000/cart", {
            data: {
              userId: user._id,
              variantId: targetItem.variantId,
            },
          });
        }
      }
    } else {
      const updated = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updated);
      saveToLocalStorage(updated);

      if (user?._id && targetItem.variantId) {
        await axios.post("http://localhost:3000/cart", {
          ...targetItem,
          userId: user._id,
          quantity: newQuantity,
        });
      }
    }
  };

  const removeItem = async (id: string) => {
    const target = cartItems.find((item) => item.id === id);
    if (!target) return;

    if (window.confirm("Xác nhận xoá sản phẩm này khỏi giỏ hàng?")) {
      const updated = cartItems.filter((item) => item.id !== id);
      setCartItems(updated);
      saveToLocalStorage(updated);
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));

      if (user?._id && target.variantId) {
        await axios.delete("http://localhost:3000/cart", {
          data: {
            userId: user._id,
            variantId: target.variantId,
          },
        });
      }
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }
    const selected = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    if (!selected.every((item) => item.variantId)) {
      alert("Một số sản phẩm trong giỏ hàng thiếu thông tin biến thể.");
      return;
    }
    localStorage.setItem("checkoutItems", JSON.stringify(selected));
    navigate("/checkout");
  };

  const subtotal = cartItems.reduce(
    (total, item) =>
      selectedItems.includes(item.id)
        ? total + item.price * item.quantity
        : total,
    0
  );

  const total = subtotal;
  const allSelected =
    selectedItems.length === cartItems.length && cartItems.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm mb-5">
        <Link to="/" className="text-gray-500 hover:text-gray-900">
          Trang chủ
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Giỏ hàng</span>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-black">Giỏ hàng của bạn</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-gray-500 mb-8">Giỏ hàng của bạn trống.</p>
              <img src="/img/empty.png" className="w-32 h-32 mb-4 mx-auto" />
            </div>
          ) : (
            <>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems(cartItems.map((item) => item.id));
                    } else {
                      setSelectedItems([]);
                    }
                  }}
                  className="mr-2"
                />
                <label className="text-black font-medium">Chọn tất cả</label>
              </div>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId || ""}-${
                      item.volume
                    }-${item.fragrance || ""}`}
                    className="flex border rounded-lg p-4 items-start"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedItems((prev) =>
                          checked
                            ? [...prev, item.id]
                            : prev.filter((id) => id !== item.id)
                        );
                      }}
                      className="mr-4 mt-2"
                    />
                    <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
                      <Link to={`/productdetails/${item.productId}`}>
                        <img
                          src={item.image.src}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link to={`/productdetails/${item.productId}`}>
                            <h3 className="font-semibold text-lg text-black hover:underline">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            Hương vị: {item.fragrance}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Dung tích: {item.volume}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border rounded overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-3 py-1 text-black hover:bg-gray-200"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <div className="px-4 py-1 text-black text-sm border-l border-r">
                            {item.quantity}
                          </div>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-3 py-1 text-black hover:bg-gray-200"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="font-bold text-red-600">
                          {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="lg:w-1/3">
          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Tóm tắt đơn hàng
            </h2>
            <div className="space-y-4 mb-6">
              <div className="border-t pt-4 flex justify-between font-semibold">
                <span className="font-bold text-red-600">Thành tiền</span>
                <span className="font-bold text-red-600">
                  {selectedItems.length > 0 ? total.toLocaleString() : "0"}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className={`w-full block text-center px-6 py-3 font-medium rounded ${
                selectedItems.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#5f518e] text-white hover:bg-[#696faa]"
              }`}
              disabled={selectedItems.length === 0}
            >
              Tiến hành Thanh toán
            </button>

            <Link
              to="/"
              className="w-full block text-center px-6 py-3 text-gray-900 font-medium mt-2"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
