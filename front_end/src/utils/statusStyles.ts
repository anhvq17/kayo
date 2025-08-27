export const getOrderStatusBadgeClass = (status: string): string => {
  const map: Record<string, string> = {
    'Chờ xử lý': 'bg-yellow-100 text-yellow-800',
    'Đã xử lý': 'bg-teal-100 text-teal-800',
    'Đang giao hàng': 'bg-purple-100 text-purple-800',
    'Đã giao hàng': 'bg-green-100 text-green-800',
    'Đã nhận hàng': 'bg-blue-100 text-blue-800',
    'Đã huỷ đơn hàng': 'bg-red-100 text-red-800',
    'Yêu cầu hoàn hàng': 'bg-orange-100 text-orange-800',
    'Đã hoàn hàng': 'bg-emerald-100 text-emerald-800',
    'Từ chối hoàn hàng': 'bg-slate-100 text-slate-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};

export const getPaymentStatusBadgeClass = (status: string): string => {
  const map: Record<string, string> = {
    'Đã thanh toán': 'bg-green-100 text-green-800',
    'Chưa thanh toán': 'bg-yellow-100 text-yellow-800',
    'Đã hoàn tiền': 'bg-blue-100 text-blue-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};


