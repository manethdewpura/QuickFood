import React from 'react';

const DeliveryStatus = ({ currentStatus, onUpdateStatus }) => {
  const statuses = [
    { value: 'assigned', label: 'Assigned' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' }
  ];

  const getCurrentStatusIndex = () => {
    return statuses.findIndex(status => status.value === currentStatus);
  };

  const getNextStatus = () => {
    const currentIndex = getCurrentStatusIndex();
    if (currentIndex < statuses.length - 1) {
      return statuses[currentIndex + 1];
    }
    return null;
  };

  const handleUpdateStatus = () => {
    const nextStatus = getNextStatus();
    if (nextStatus) {
      onUpdateStatus(nextStatus.value);
    }
  };

  return (
    <div className="delivery-status my-6">
    <h2 className="text-xl font-semibold text-indigo-600 mb-2">Delivery Status</h2>
    <div className="flex space-x-4 mb-4">
      {statuses.map((status, index) => (
        <div
          key={status.value}
          className={`flex flex-col items-center ${index <= getCurrentStatusIndex() ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <div className={`w-4 h-4 rounded-full mb-1 ${index <= getCurrentStatusIndex() ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
          <div className="text-xs">{status.label}</div>
        </div>
      ))}
    </div>
    {getNextStatus() && (
      <button
        className="update-status-btn w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700"
        onClick={handleUpdateStatus}
      >
        Mark as {getNextStatus().label}
      </button>
    )}
  </div>
  
  );
};

export default DeliveryStatus;
