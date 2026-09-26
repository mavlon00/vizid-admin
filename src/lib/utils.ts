import { OrderStatus } from '../types';

/**
 * Formats a numeric amount into Nigerian Naira currency representation (₦)
 */
export const formatNaira = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₦0';
  return '₦' + Number(amount).toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

/**
 * Formats ISO date string into readable date and time
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Returns Tailwind badge classes for given order status
 */
export const getOrderStatusBadgeStyle = (status: OrderStatus | string): {
  bg: string;
  text: string;
  border: string;
  dot: string;
  label: string;
} => {
  const normalized = (status || '').toLowerCase();
  
  switch (normalized) {
    case 'paid':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-400',
        label: 'Paid',
      };
    case 'pending':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-400',
        label: 'Pending',
      };
    case 'processing':
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        dot: 'bg-blue-400',
        label: 'Processing',
      };
    case 'shipped':
      return {
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-400',
        border: 'border-indigo-500/30',
        dot: 'bg-indigo-400',
        label: 'Shipped',
      };
    case 'delivered':
      return {
        bg: 'bg-teal-500/10',
        text: 'text-teal-400',
        border: 'border-teal-500/30',
        dot: 'bg-teal-400',
        label: 'Delivered',
      };
    case 'failed':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        dot: 'bg-rose-400',
        label: 'Failed',
      };
    case 'cancelled':
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        dot: 'bg-slate-400',
        label: 'Cancelled',
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-300',
        border: 'border-slate-500/30',
        dot: 'bg-slate-400',
        label: status || 'Unknown',
      };
  }
};

/**
 * Extracts storage filename from a public Supabase URL
 */
export const extractStoragePath = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;
  try {
    const url = new URL(imageUrl);
    // URL path usually looks like /storage/v1/object/public/product-images/filename.jpg
    const parts = url.pathname.split('product-images/');
    if (parts.length > 1) {
      return decodeURIComponent(parts[1]);
    }
  } catch {
    // If not a valid URL, try simple string split
    if (imageUrl.includes('product-images/')) {
      return imageUrl.split('product-images/')[1];
    }
  }
  return null;
};
