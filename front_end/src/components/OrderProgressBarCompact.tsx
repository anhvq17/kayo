import React from 'react';

interface OrderProgressBarCompactProps {
  currentStatus: string;
}

const OrderProgressBarCompact: React.FC<OrderProgressBarCompactProps> = ({ currentStatus }) => {
  const statuses = [
    'Chờ xử lý',
    'Đã xử lý',
    'Đang giao hàng',
    'Đã giao hàng',
    'Đã nhận hàng'
  ];

  const getStatusIndex = (status: string) => {
    return statuses.indexOf(status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  // Xử lý các trạng thái đặc biệt
  const isSpecialStatus = (status: string) => {
    return ['Đã huỷ đơn hàng', 'Yêu cầu hoàn hàng', 'Đã hoàn hàng', 'Từ chối hoàn hàng'].includes(status);
  };

  // Nếu là trạng thái đặc biệt, hiển thị thông báo ngắn gọn
  if (isSpecialStatus(currentStatus)) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium">
          {currentStatus === 'Đã huỷ đơn hàng' && (
            <span className="text-red-600">❌ Hủy</span>
          )}
          {currentStatus === 'Yêu cầu hoàn hàng' && (
            <span className="text-orange-600">🔄 Yêu cầu hoàn</span>
          )}
          {currentStatus === 'Đã hoàn hàng' && (
            <span className="text-blue-600">✅ Đã hoàn</span>
          )}
          {currentStatus === 'Từ chối hoàn hàng' && (
            <span className="text-gray-600">❌ Từ chối</span>
          )}
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Chờ xử lý': return '⏳';
      case 'Đã xử lý': return '✅';
      case 'Đang giao hàng': return '🚚';
      case 'Đã giao hàng': return '📦';
      case 'Đã nhận hàng': return '🎉';
      default: return '📋';
    }
  };

  const getStatusColor = (statusIndex: number, currentIndex: number) => {
    if (statusIndex < currentIndex) {
      return 'bg-green-500 text-white'; // Đã hoàn thành
    } else if (statusIndex === currentIndex) {
      return 'bg-blue-500 text-white'; // Đang thực hiện
    } else {
      return 'bg-gray-300 text-gray-500'; // Chưa thực hiện
    }
  };

  const getLineColor = (statusIndex: number, currentIndex: number) => {
    if (statusIndex < currentIndex) {
      return 'bg-green-500'; // Đã hoàn thành
    } else {
      return 'bg-gray-300'; // Chưa hoàn thành
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {statuses.map((status, index) => (
          <React.Fragment key={status}>
            {/* Status Circle */}
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shadow-sm transition-all duration-300 ${getStatusColor(index, currentIndex)}`}>
                {getStatusIcon(status)}
              </div>
            </div>
            
            {/* Connecting Line */}
            {index < statuses.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 transition-all duration-300 ${getLineColor(index, currentIndex)}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OrderProgressBarCompact; 