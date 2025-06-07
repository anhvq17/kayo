import { useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Minus, X } from "lucide-react"

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Jean Paul Gaultier",
      price: 35.0,
      quantity: 2,
      size: "100ml",
      image: {
        src: "https://byvn.net/CD9y",
        width: 100,
        height: 100
      }
    },
    {
      id: 2,
      name: "Jean Paul Gaultier",
      price: 35.0,
      quantity: 5,
      size: "100ml",
      image: {
        src: "https://byvn.net/QbEB"
      }
    }
  ])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const total = subtotal

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
              <p className="text-gray-500 mb-4">Giỏ hàng của bạn trống.</p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-gray-900 text-white font-medium rounded hover:bg-gray-800"
              >
                Tiếp tục mua sắm
              </Link>
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
                        <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
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
                      <div className="font-medium text-black">{(item.price * item.quantity).toFixed(3)}</div>
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
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng</span>
                <span className="text-black">{subtotal.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="text-black">Miễn phí</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                <span className="text-black">Thành tiền</span>
                <span className="text-black">{total.toFixed(3)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full block text-center px-6 py-3 bg-gray-900 text-white font-medium rounded hover:bg-gray-800"
            >
              Tiến hành Thanh toán
            </Link>

            <Link
              to="/"
              className="w-full block text-center px-6 py-3 text-gray-600 font-medium mt-2 hover:text-gray-900"
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