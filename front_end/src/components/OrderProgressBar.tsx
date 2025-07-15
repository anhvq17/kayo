import React from 'react';

interface OrderProgressBarProps {
  currentStatus: string;
}

const OrderProgressBar: React.FC<OrderProgressBarProps> = ({ currentStatus }) => {
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

  // Nếu là trạng thái đặc biệt, hiển thị thông báo thay vì progress bar
  if (isSpecialStatus(currentStatus)) {
    return (
      <div className="w-full py-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
            {currentStatus === 'Đã huỷ đơn hàng' && (
              <span className="text-red-600">❌ Đơn hàng đã bị hủy</span>
            )}
            {currentStatus === 'Yêu cầu hoàn hàng' && (
              <span className="text-orange-600">🔄 Đang yêu cầu hoàn hàng</span>
            )}
            {currentStatus === 'Đã hoàn hàng' && (
              <span className="text-blue-600">✅ Đã hoàn hàng</span>
            )}
            {currentStatus === 'Từ chối hoàn hàng' && (
              <span className="text-gray-600">❌ Từ chối hoàn hàng</span>
            )}
          </div>
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
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {statuses.map((status, index) => (
          <React.Fragment key={status}>
            {/* Status Circle */}
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold shadow-lg transition-all duration-300 ${getStatusColor(index, currentIndex)}`}>
                {getStatusIcon(status)}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-medium transition-colors duration-300 ${
                  index <= currentIndex ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {status}
                </p>
              </div>
            </div>
            
            {/* Connecting Line */}
            {index < statuses.length - 1 && (
              <div className={`flex-1 h-1 mx-4 transition-all duration-300 ${getLineColor(index, currentIndex)}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OrderProgressBar; 