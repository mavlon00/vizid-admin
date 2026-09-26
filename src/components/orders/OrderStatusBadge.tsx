import React from 'react';
import { OrderStatus } from '../../types';
import { getOrderStatusBadgeStyle } from '../../lib/utils';

interface OrderStatusBadgeProps {
  status: OrderStatus | string;
  size?: 'sm' | 'md';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const style = getOrderStatusBadgeStyle(status);

  const sizeClasses =
    size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${style.bg} ${style.text} ${style.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`} />
      <span>{style.label}</span>
    </span>
  );
};
