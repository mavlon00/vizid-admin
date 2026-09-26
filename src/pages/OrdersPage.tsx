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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-amber-400" />
            <span>Orders Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track customer purchases, update delivery status, and review payment details.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors self-start sm:self-auto"
          title="Refresh orders list"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
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
