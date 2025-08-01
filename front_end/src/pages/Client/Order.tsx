import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getOrdersByUserWithItems, updateOrder } from '../../services/Order';

// Thêm type cho OrderItem
interface OrderItem {
  _id: string;
  variantId: {
    _id: string;
    image: string;
    productId: {
      _id: string;
      name: string;
      image: string;
    };
    attributes?: {
      attributeId: {
        _id: string;
        name: string;
      };
      valueId: {
        _id: string;
        value: string;
      };
    }[];
  };
  quantity: number;
  price: number;
  isReviewed?: boolean; // Add this property
}

const ORDER_TABS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ xử lý', value: 'Chờ xử lý' },
  { label: 'Đã xử lý', value: 'Đã xử lý' },
  { label: 'Đang giao hàng', value: 'Đang giao hàng' },
  { label: 'Đã giao hàng', value: 'Đã giao hàng' },
  { label: 'Đã nhận hàng', value: 'Đã nhận hàng' },
  { label: 'Đã huỷ đơn hàng', value: 'Đã huỷ đơn hàng' },
];

const OrderList = () => {
  const [orderList, setOrderList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState('all');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [requestingReturnId, setRequestingReturnId] = useState<string | null>(null);
  const [confirmingReceivedId, setConfirmingReceivedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const didMountRef = useRef(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const data = await getOrdersByUserWithItems(user._id);
      if (Array.isArray(data)) {
        setOrderList(data);
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    didMountRef.current = true;
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && didMountRef.current) {
        fetchOrders();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);
  console.log(orderList);
 
  const getStatusText = (orderStatus: string) => {
    switch (orderStatus) {
      case 'Chờ xử lý': return 'Chờ xử lý';
      case 'Đã xử lý': return 'Đã xử lý';
      case 'Đang giao hàng': return 'Đang giao hàng';
      case 'Đã giao hàng': return 'Đã giao hàng';
      case 'Đã nhận hàng': return 'Đã nhận hàng';
      case 'Đã huỷ đơn hàng': return 'Đã huỷ đơn hàng';
      default: return orderStatus;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod': return 'Thanh toán khi nhận hàng (COD)';
      case 'vnpay': return 'Thanh toán online (VNPay)';
      default: return method;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'Đã thanh toán':
        return 'Đã thanh toán';
      case 'Chưa thanh toán':
        return 'Chưa thanh toán';
      case 'Chờ thanh toán':
        return 'Chờ thanh toán';
      case 'Đã hoàn tiền':
        return 'Đã hoàn tiền';
      default:
        return status;
    }
  };

  const canCancelOrder = (orderStatus: string) => {
    return orderStatus === 'Chờ xử lý' || orderStatus === 'Đã xử lý';
  };

  const canRequestReturn = (orderStatus: string) => {
    return orderStatus === 'Đã nhận hàng';
  };

  const canConfirmReceived = (orderStatus: string) => {
    return orderStatus === 'Đã giao hàng';
  };

  const handleCancelOrder = async () => {
    if (!selectedOrderId || !cancelReason.trim()) return;

    try {
      setCancellingOrderId(selectedOrderId);
      const order = orderList.find(o => o._id === selectedOrderId);
      const updateData: any = { 
        orderStatus: 'Đã huỷ đơn hàng',
        cancelReason: cancelReason.trim()
      };
      
      if (order && order.paymentMethod === 'vnpay') {
        updateData.paymentStatus = 'Đã hoàn tiền';
      }
      
      await updateOrder(selectedOrderId, updateData);
      
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const data = await getOrdersByUserWithItems(user._id);
      if (Array.isArray(data)) {
        setOrderList(data);
      }
      
      setShowCancelModal(false);
      setSelectedOrderId(null);
      setCancelReason('');
      
      if (order && order.paymentMethod === 'vnpay') {
        setSuccessMessage('Hủy đơn hàng thành công! Trạng thái thanh toán đã được cập nhật thành "Đã hoàn tiền".');
      } else {
        setSuccessMessage('Hủy đơn hàng thành công!');
      }
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi hủy đơn hàng.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleRequestReturn = async () => {
    if (!selectedOrderId || !returnReason.trim()) return;

    try {
      setRequestingReturnId(selectedOrderId);
      await updateOrder(selectedOrderId, { 
        orderStatus: 'Yêu cầu hoàn hàng',
        returnReason: returnReason.trim()
      });
      
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const data = await getOrdersByUserWithItems(user._id);
      if (Array.isArray(data)) {
        setOrderList(data);
      }
      
      setShowReturnModal(false);
      setSelectedOrderId(null);
      setReturnReason('');
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi yêu cầu hoàn hàng.');
    } finally {
      setRequestingReturnId(null);
    }
  };

  const handleConfirmReceived = async (orderId: string) => {
    try {
      setConfirmingReceivedId(orderId);
      setError(null);
      setSuccessMessage(null);
      
      await updateOrder(orderId, { 
        orderStatus: 'Đã nhận hàng'
      });
      
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const data = await getOrdersByUserWithItems(user._id);
      if (Array.isArray(data)) {
        setOrderList(data);
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi xác nhận nhận hàng.');
    } finally {
      setConfirmingReceivedId(null);
    }
  };

  const openCancelModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const openReturnModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setReturnReason('');
    setShowReturnModal(true);
  };

  const filteredOrders = tab === 'all' ? orderList : orderList.filter((o) => o.orderStatus === tab);
  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  
  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            {error}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            {successMessage}
          </div>
        </div>
      )}

      <div className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Đơn hàng</span>
      </div>

      <div className="mx-auto mt-10 text-center">
        <h1 className="text-3xl font-bold flex items-center gap-2 justify-center">
          DANH SÁCH ĐƠN HÀNG
        </h1>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mt-8 mb-8">
        {ORDER_TABS.map((t) => (
          <button
            key={t.value}
            className={`px-4 py-2 rounded-full font-semibold border transition text-sm ${tab === t.value ? 'bg-[#5f518e] text-white border-[#5f518e]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mx-auto my-10 max-w-5xl space-y-6 px-2 md:px-0">
        {loading ? (
          <div className="text-center text-blue-500 py-8">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : sortedOrders.length > 0 ? (
          sortedOrders.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col gap-4 hover:shadow-xl transition">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2">
                    <div>
                      <p className="text-base text-gray-500 flex items-center gap-2">
                        <i className="fas fa-barcode text-gray-600"></i>
                        Mã vận đơn: <span className="font-semibold text-gray-800">{item._id}</span>
                      </p>
                      <p className="text-base text-gray-500 flex items-center gap-2 mt-1">
                        <i className="fas fa-clock text-gray-600"></i>
                        Thời gian tạo: <span className="font-medium text-gray-800">{new Date(item.createdAt).toLocaleString("vi-VN")}</span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 mt-2 md:mt-0">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        item.orderStatus === 'Đã xử lý' ? 'bg-green-100 text-green-800' :
                        item.orderStatus === 'Chờ xử lý' ? 'bg-yellow-100 text-yellow-800' :
                        item.orderStatus === 'Đang giao hàng' ? 'bg-blue-100 text-blue-800' :
                        item.orderStatus === 'Đã giao hàng' ? 'bg-green-100 text-green-800' :
                        item.orderStatus === 'Đã nhận hàng' ? 'bg-green-200 text-green-900' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getStatusText(item.orderStatus)}
                      </span>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        getPaymentStatusText(item.paymentStatus) === 'Đã thanh toán' ? 'bg-green-100 text-green-800' :
                        getPaymentStatusText(item.paymentStatus) === 'Đã hoàn tiền' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'}`}
                      >
                        {getPaymentStatusText(item.paymentStatus)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <p className="text-base text-gray-500 flex items-center gap-2">
                      <i className="fas fa-wallet text-gray-600"></i>
                      Tổng tiền thanh toán:
                      <span className="text-red-500 font-bold">
                        {item.totalAmount.toLocaleString()}
                      </span>
                      {item.voucherCode && item.discount > 0 && (
                        <span className="ml-2 text-sm font-semibold text-gray-800">
                          (Giảm giá:
                          <span className="text-red-500 font-semibold ml-1">
                            {item.discountType === 'percent' && typeof item.discountValue === 'number'
                              ? `-${item.discountValue}%`
                              : `-${item.discount?.toLocaleString()}`}
                          </span>)
                        </span>
                      )}
                    </p>

                    <p className="text-base text-gray-500 flex items-center gap-2">
                      <i className="fas fa-credit-card text-gray-600"></i>
                      Phương thức thanh toán: <span className="font-semibold text-gray-800">{getPaymentMethodText(item.paymentMethod)}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end md:justify-center mt-4 md:mt-0 gap-2">
                  <Link to={`/orders/${item._id}`}
                    className="inline-flex items-center gap-2 bg-[#5f518e] text-white px-5 py-2 rounded-lg font-semibold shadow hover:opacity-90 transition text-sm">
                    Xem chi tiết
                  </Link>
                  {canCancelOrder(item.orderStatus) && (
                    <button
                      onClick={() => openCancelModal(item._id)}
                      className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-red-700 transition text-sm"
                    >
                     Hủy đơn hàng
                    </button>
                  )}
                  {canConfirmReceived(item.orderStatus) && (
                    <button
                      onClick={() => handleConfirmReceived(item._id)}
                      disabled={confirmingReceivedId === item._id}
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition text-sm disabled:opacity-50"
                    >
                      {confirmingReceivedId === item._id ? 'Đang xác nhận...' : 'Đã nhận hàng'}
                    </button>
                  )}
                  {canRequestReturn(item.orderStatus) && (
              <>
                <button
                  onClick={() => openReturnModal(item._id)}
                  disabled={requestingReturnId === item._id}
                  className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-orange-700 transition text-sm disabled:opacity-50"
                >
                  {requestingReturnId === item._id ? 'Đang gửi...' : 'Yêu cầu hoàn hàng'}
                </button>

                

              </>
            )}
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                {item.items && item.items.length > 0 ? (
                  item.items.map((prod: OrderItem) => (
                    <div key={prod._id} className="flex items-center gap-4 py-2 border-b last:border-b-0">
                      <img src={ prod.variantId?.image} alt={prod.variantId?.productId?.name} className="w-20 h-20 object-cover rounded border" />
                      <div className="flex-1">
                        <div className="text-lg font-medium text-gray-900">{prod.variantId?.productId?.name || 'Sản phẩm'}</div>
                        <div className="text-xs text-gray-500">
                          {prod.variantId?.attributes?.map((attr, i) => (
                            <span key={i} className="mr-2">{attr.attributeId?.name}: {attr.valueId?.value}</span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500">Số lượng: {prod.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold text-red-500">{prod.price.toLocaleString()}</div>
                       {item.orderStatus === 'Đã nhận hàng' && !prod.isReviewed && (
                            <Link
                              to={`/review/${prod.variantId?.productId?._id}/${prod._id}`}
                              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition text-sm"
                            >
                              Đánh giá
                            </Link>
                          )}
                          {prod.isReviewed && (
                            <span className="inline-block text-sm text-gray-500 italic">Đã đánh giá</span>
                          )}


                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm">Không có sản phẩm</div>
                )}
              </div>
              
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">Danh sách trống</div>
        )}
      </div>

      {/* Modal xác nhận hủy đơn hàng */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Hủy đơn hàng</h3>
            <div className="mb-4">
              <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn hủy đơn hàng này không?
              </p>
              
              {/* Form nhập lý do hủy đơn hàng */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do hủy đơn hàng <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Vui lòng nhập lý do hủy đơn hàng..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows={4}
                  required
                />
                {!cancelReason.trim() && (
                  <p className="text-red-500 text-xs mt-1">Vui lòng nhập lý do hủy đơn hàng</p>
                )}
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                <span role="img" aria-label="warning">⚠️</span> Lưu ý: Hành động này không thể hoàn tác!
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedOrderId(null);
                  setCancelReason('');
                }}
                disabled={cancellingOrderId !== null}
                className="border bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition duration-200 disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button 
                type="button"
                onClick={handleCancelOrder}
                disabled={cancellingOrderId !== null || !cancelReason.trim()}
                className="border bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition duration-200 disabled:opacity-50"
              >
                {cancellingOrderId ? 'Đang hủy...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal yêu cầu hoàn hàng */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4 text-orange-600">Yêu cầu hoàn hàng</h3>
            <div className="mb-4">
              <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn yêu cầu hoàn hàng cho đơn hàng này không?
              </p>
              
              {/* Form nhập lý do hoàn hàng */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do hoàn hàng <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Vui lòng nhập lý do hoàn hàng..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  rows={4}
                  required
                />
                {!returnReason.trim() && (
                  <p className="text-red-500 text-xs mt-1">Vui lòng nhập lý do hoàn hàng</p>
                )}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                <span role="img" aria-label="info">ℹ️</span> Yêu cầu hoàn hàng sẽ được gửi đến admin để xem xét và phê duyệt. Nếu thanh toán qua VNPAY và được chấp thuận, bạn sẽ được hoàn tiền.
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={() => {
                  setShowReturnModal(false);
                  setSelectedOrderId(null);
                  setReturnReason('');
                }}
                disabled={requestingReturnId !== null}
                className="border bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition duration-200 disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button 
                type="button"
                onClick={handleRequestReturn}
                disabled={requestingReturnId !== null || !returnReason.trim()}
                className="border bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm transition duration-200 disabled:opacity-50"
              >
                {requestingReturnId ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;