import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Order, OrderStatus } from '../../types';
import { formatNaira, formatDate } from '../../lib/utils';
import { OrderStatusBadge } from './OrderStatusBadge';
import {
  Package,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  User,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  if (!order) return null;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    if (newStatus === order.status) return;

    setIsUpdating(true);
    await onUpdateStatus(order.id, newStatus);
    setIsUpdating(false);
  };

  const handleCopyRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const statusOptions: OrderStatus[] = [
    'pending',
    'paid',
    'processing',
    'shipped',
    'delivered',
    'failed',
    'cancelled',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order #${order.id.substring(0, 8)}`}
      subtitle={`Placed on ${formatDate(order.created_at)}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Top Summary Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div>
            <div className="text-xs text-slate-400 font-medium">Order Status</div>
            <div className="mt-1 flex items-center gap-3">
              <OrderStatusBadge status={order.status} />
              {isUpdating && <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />}
            </div>
          </div>

          {/* Quick Status Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-medium shrink-0">
              Update Status:
            </label>
            <select
              value={order.status}
              onChange={handleStatusChange}
              disabled={isUpdating}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer disabled:opacity-50"
            >
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Customer & Delivery Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone & User */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Customer Details</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold">{order.phone_number || 'N/A'}</span>
              </div>
              <div className="text-slate-400 font-mono text-[11px] truncate">
                User ID: {order.user_id}
              </div>
            </div>
          </div>

          {/* Paystack Reference */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Payment Details</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Amount:</span>
                <span className="font-extrabold text-amber-400 text-sm">
                  {formatNaira(order.total_amount)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                <span className="text-slate-400">Paystack Ref:</span>
                {order.paystack_reference ? (
                  <button
                    onClick={() => handleCopyRef(order.paystack_reference!)}
                    className="font-mono text-[11px] text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-700/60 flex items-center gap-1.5 hover:border-amber-500/50 transition-colors"
                    title="Click to copy"
                  >
                    <span>{order.paystack_reference}</span>
                    {copiedRef ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                ) : (
                  <span className="text-slate-400 italic font-mono text-[11px]">None</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address Box */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Delivery Address</span>
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed font-sans pl-5">
            {order.delivery_address || 'No address provided.'}
          </p>
        </div>

        {/* Order Items List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>Ordered Items ({order.items?.length || 0})</span>
          </h4>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl divide-y divide-slate-800/60 overflow-hidden">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 shrink-0">
                        <Package className="w-5 h-5 opacity-40" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h5 className="font-semibold text-xs sm:text-sm text-slate-100 truncate">
                        {item.name}
                      </h5>
                      <p className="text-[11px] text-slate-400">
                        {formatNaira(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-xs sm:text-sm text-amber-400">
                      {formatNaira((item.price || 0) * (item.quantity || 1))}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                No items detailed in order payload.
              </div>
            )}
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </Modal>
  );
};
