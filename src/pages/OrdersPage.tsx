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
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
            <span>Orders Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 font-sans">
            Track customer purchases, update delivery status, and review payment details.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-stone-300 hover:text-white hover:border-[#D4AF37]/40 transition-colors self-start sm:self-auto shadow-sm"
          title="Refresh orders list"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#D4AF37]' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
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
