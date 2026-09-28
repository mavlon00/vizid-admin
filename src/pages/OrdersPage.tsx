import React, { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { OrderTable } from '../components/orders/OrderTable';
import { OrderDetailModal } from '../components/orders/OrderDetailModal';
import { useToast } from '../hooks/useToast';
import { Order, OrderStatus } from '../types';
import { ShoppingBag, RefreshCw } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { orders, isLoading, error, refetch, updateOrderStatus } = useOrders();
  const { showSuccess, showError } = useToast();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ): Promise<boolean> => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      showSuccess('Order Updated', `Status changed to "${newStatus.toUpperCase()}"`);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      return true;
    } else {
      showError('Status Update Failed', res.error);
      return false;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2C2C] tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-[#c9a96e]" />
            <span>Orders Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1 font-sans">
            Track customer purchases, update delivery status, and review payment details.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="p-2.5 rounded-xl bg-white border border-[#E8E6E1] text-[#666666] hover:text-[#2C2C2C] hover:border-[#c9a96e] transition-colors self-start sm:self-auto shadow-sm"
          title="Refresh orders list"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#c9a96e]' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {/* Orders Data Table */}
      <OrderTable
        orders={orders}
        isLoading={isLoading}
        onViewOrder={(order) => {
          setSelectedOrder(order);
          setIsDetailModalOpen(true);
        }}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Detail Modal */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

