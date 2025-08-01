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

  const isSpecialStatus = (status: string) => {
    return ['Đã huỷ đơn hàng', 'Yêu cầu hoàn hàng', 'Đã hoàn hàng', 'Từ chối hoàn hàng'].includes(status);
  };

  if (isSpecialStatus(currentStatus)) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
          {currentStatus === 'Đã huỷ đơn hàng' && (
            <span className="text-red-600">
              <i className="fas fa-times-circle mr-1"></i> Đơn hàng đã bị hủy
            </span>
          )}
          {currentStatus === 'Yêu cầu hoàn hàng' && (
            <span className="text-orange-600">
              <i className="fas fa-undo-alt mr-1"></i> Đang yêu cầu hoàn hàng
            </span>
          )}
          {currentStatus === 'Đã hoàn hàng' && (
            <span className="text-green-600">
              <i className="fas fa-check-circle mr-1"></i> Đã hoàn hàng
            </span>
          )}
          {currentStatus === 'Từ chối hoàn hàng' && (
            <span className="text-gray-600">
              <i className="fas fa-ban mr-1"></i> Từ chối hoàn hàng
            </span>
          )}
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Chờ xử lý': return <i className="fas fa-hourglass-start text-white"></i>;
      case 'Đã xử lý': return <i className="fas fa-check-circle text-white"></i>;
      case 'Đang giao hàng': return <i className="fas fa-shipping-fast text-white"></i>;
      case 'Đã giao hàng': return <i className="fas fa-box text-white"></i>;
      case 'Đã nhận hàng': return <i className="fas fa-box-open text-white"></i>;
      default: return <i className="fas fa-clipboard-list text-white"></i>;
    }
  };

  const getStatusColor = (statusIndex: number, currentIndex: number) => {
    if (statusIndex < currentIndex) {
      return 'bg-green-500 text-white';
    } else if (statusIndex === currentIndex) {
      return 'bg-blue-500 text-white';
    } else {
      return 'bg-gray-300 text-gray-500';
    }
  };

  const getLineColor = (statusIndex: number, currentIndex: number) => {
    if (statusIndex < currentIndex) {
      return 'bg-green-500';
    } else {
      return 'bg-gray-300';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {statuses.map((status, index) => (
          <React.Fragment key={status}>
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shadow-sm transition-all duration-300 ${getStatusColor(index, currentIndex)}`}>
                {getStatusIcon(status)}
              </div>
            </div>
            
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