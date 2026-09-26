import React, { useState, useMemo } from 'react';
import { Order, OrderStatus } from '../../types';
import { formatNaira, formatDate } from '../../lib/utils';
import { OrderStatusBadge } from './OrderStatusBadge';
import {
  Search,
  Filter,
  Eye,
  ShoppingBag,
  ChevronRight,
  Phone,
  CreditCard,
} from 'lucide-react';
import { TableSkeleton } from '../common/Skeleton';

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  isLoading,
  onViewOrder,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        term === '' ||
        order.id.toLowerCase().includes(term) ||
        (order.phone_number && order.phone_number.toLowerCase().includes(term)) ||
        (order.paystack_reference &&
          order.paystack_reference.toLowerCase().includes(term)) ||
        (order.delivery_address &&
          order.delivery_address.toLowerCase().includes(term));

      const matchesStatus =
        selectedStatus === 'All' ||
        order.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  const handleInlineStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    orderId: string
  ) => {
    e.stopPropagation();
    const newStatus = e.target.value as OrderStatus;
    setUpdatingOrderId(orderId);
    await onUpdateStatus(orderId, newStatus);
    setUpdatingOrderId(null);
  };

  const statusOptions: { value: string; label: string }[] = [
    { value: 'All', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by phone number, Paystack ref, or Order ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>

        {/* Status Dropdown Filter */}
        <div className="relative flex-1 sm:flex-none">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto pl-9 pr-8 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500 cursor-pointer appearance-none"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={6} cols={6} />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto mb-4 text-slate-500">
              <ShoppingBag className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">No orders found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {orders.length === 0
                ? 'No customer orders have been received yet.'
                : 'No orders match your search query or status filter.'}
            </p>
            {orders.length > 0 && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('All');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Order ID / Reference</th>
                  <th className="py-4 px-6">Customer Phone</th>
                  <th className="py-4 px-6">Total Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => onViewOrder(order)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Order ID & Reference */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <div className="font-mono text-xs font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                          #{order.id.substring(0, 8)}
                        </div>
                        {order.paystack_reference && (
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-slate-500" />
                            <span>{order.paystack_reference}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Customer Phone */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{order.phone_number || 'N/A'}</span>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-4 px-6 font-extrabold text-amber-400">
                      {formatNaira(order.total_amount)}
                    </td>

                    {/* Status Dropdown / Badge */}
                    <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <OrderStatusBadge status={order.status} size="sm" />
                        <select
                          value={order.status}
                          onChange={(e) => handleInlineStatusChange(e, order.id)}
                          disabled={updatingOrderId === order.id}
                          className="bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-semibold text-slate-300 px-2 py-1 focus:outline-none focus:border-amber-500 cursor-pointer disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="failed">Failed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(order.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewOrder(order);
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition-all inline-flex items-center gap-1 text-xs font-semibold"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
