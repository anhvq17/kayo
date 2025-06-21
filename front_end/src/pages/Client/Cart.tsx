import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Minus, X } from "lucide-react"

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
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    if (raw) {
      try {
        const data = JSON.parse(raw);

        const items: CartItem[] = data.map((item: any) => ({
          id: `${item._id}-${item.selectedScent}-${item.selectedVolume}`,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          volume: item.selectedVolume,
          fragrance: item.selectedScent,
          image: typeof item.image === "string"
            ? { src: item.image, width: 100, height: 100 }
            : item.image,
        }));

        setCartItems(items);
      } catch (error) {
        console.error("Lỗi khi parse localStorage:", error);
      }
    }
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updated);
    saveToLocalStorage(updated);
  }

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    saveToLocalStorage(updated);
  };

  const saveToLocalStorage = (items: CartItem[]) => {
    const formatted = items.map((item) => ({
      _id: item.id.split("-")[0],
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      selectedVolume: item.volume,
      selectedScent: item.fragrance,
      image: item.image.src,
    }));
    localStorage.setItem("cart", JSON.stringify(formatted));
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm mb-5">
        <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link>
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
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex border rounded-lg p-4">
                  <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image.src}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-black">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">Hương vị: {item.fragrance}</p>
                        <p className="text-sm text-gray-500 mt-1">Dung tích: {item.volume}ml</p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border rounded overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-black hover:bg-gray-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="px-4 py-1 text-black text-sm border-l border-r">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-black hover:bg-gray-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="font-bold text-red-600">{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:w-1/3">
          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-black">Tóm tắt đơn hàng</h2>

            <div className="space-y-4 mb-6">
              <div className="border-t pt-4 flex justify-between font-semibold">
                <span className="font-bold text-red-600">Thành tiền</span>
                <span className="font-bold text-red-600">{total.toLocaleString()}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full block text-center px-6 py-3 bg-[#5f518e] text-white font-medium rounded hover:bg-[#696faa]"
            >
              Tiến hành Thanh toán
            </Link>

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
  )
}

export default Cart
