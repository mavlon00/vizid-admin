import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useOrders } from '../hooks/useOrders';
import { formatNaira, formatDate } from '../lib/utils';
import { OrderStatusBadge } from '../components/orders/OrderStatusBadge';
import { OrderDetailModal } from '../components/orders/OrderDetailModal';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { StatCard } from '../components/common/StatCard';
import { useToast } from '../hooks/useToast';
import { Order, ProductFormData } from '../types';
import {
  Package,
  ShoppingBag,
  Clock,
  Banknote,
  Plus,
  ArrowRight,
  Eye,
  Sparkles,
} from 'lucide-react';
import { Skeleton } from '../components/common/Skeleton';

export const DashboardOverviewPage: React.FC = () => {
  const { products, isLoading: isLoadingProducts, addProduct } = useProducts();
  const { orders, isLoading: isLoadingOrders, updateOrderStatus } = useOrders();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Compute stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (o) => (o.status || '').toLowerCase() === 'pending'
    ).length;

    const paidOrdersList = orders.filter(
      (o) => (o.status || '').toLowerCase() === 'paid'
    );

    const totalRevenue = paidOrdersList.reduce(
      (sum, o) => sum + (Number(o.total_amount) || 0),
      0
    );

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return {
      totalProducts,
      totalOrders,
      pendingOrders,
      paidOrdersCount: paidOrdersList.length,
      totalRevenue,
      recentOrders,
    };
  }, [products, orders]);

  const handleUpdateStatus = async (orderId: string, status: any) => {
    const res = await updateOrderStatus(orderId, status);
    if (res.success) {
      showSuccess('Order Updated', `Order status changed to ${status}`);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
      }
      return true;
    } else {
      showError('Update Failed', res.error);
      return false;
    }
  };

  const handleCreateProduct = async (formData: ProductFormData) => {
    const res = await addProduct(formData);
    if (res.success) {
      showSuccess('Product Created', `${formData.name} added to public store.`);
      return true;
    } else {
      showError('Failed to Create Product', res.error);
      return false;
    }
  };

  const isLoading = isLoadingProducts || isLoadingOrders;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Dashboard Overview</span>
            <span className="text-[11px] px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] font-semibold tracking-wider uppercase font-sans">
              Live Store
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 font-sans">
            Real-time performance metrics and store management overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="btn-gold px-4 py-2.5 rounded-xl text-black font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 font-sans"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 rounded-2xl glass-card">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              subtitle="Live on storefront"
              icon={<Package className="w-6 h-6" />}
              iconBg="bg-[#D4AF37]/15"
              iconColor="text-[#D4AF37]"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              subtitle={`${stats.paidOrdersCount} paid orders`}
              icon={<ShoppingBag className="w-6 h-6" />}
              iconBg="bg-blue-500/15"
              iconColor="text-blue-400"
            />
            <StatCard
              title="Pending Orders"
              value={stats.pendingOrders}
              subtitle="Awaiting processing/payment"
              icon={<Clock className="w-6 h-6" />}
              iconBg="bg-amber-500/15"
              iconColor="text-amber-400"
            />
            <StatCard
              title="Total Revenue"
              value={formatNaira(stats.totalRevenue)}
              subtitle="Sum of completed paid orders"
              icon={<Banknote className="w-6 h-6" />}
              iconBg="bg-emerald-500/15"
              iconColor="text-emerald-400"
            />
          </>
        )}
      </div>

      {/* Recent Orders & Quick Shortcuts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (2 cols on lg) */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div>
              <h3 className="font-serif font-bold text-white text-xl">Recent Orders</h3>
              <p className="text-xs text-stone-300">Last 5 customer orders received</p>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="text-xs font-semibold text-[#D4AF37] hover:text-[#F4E0A5] flex items-center gap-1 group transition-colors"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            {isLoadingOrders ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : stats.recentOrders.length === 0 ? (
              <div className="p-12 text-center text-xs text-stone-400">
                No customer orders placed yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#141414] text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                    <th className="py-3.5 px-6">Order</th>
                    <th className="py-3.5 px-6">Phone</th>
                    <th className="py-3.5 px-6">Total</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {stats.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsOrderDetailOpen(true);
                      }}
                      className="hover:bg-white/[0.04] cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-6 font-mono font-bold text-white">
                        #{order.id.substring(0, 8)}
                      </td>
                      <td className="py-3.5 px-6 text-stone-200">
                        {order.phone_number || 'N/A'}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-[#D4AF37]">
                        {formatNaira(order.total_amount)}
                      </td>
                      <td className="py-3.5 px-6">
                        <OrderStatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                            setIsOrderDetailOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-[#D4AF37] hover:bg-white/10 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Shortcuts & Summary Card (1 col on lg) */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-white text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <span>Quick Actions</span>
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="w-full p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37]">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Add New Product</div>
                    <div className="text-[10px] text-stone-400">Upload item to store</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Manage Catalog</div>
                    <div className="text-[10px] text-stone-400">Edit prices & inventory</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/orders')}
                className="w-full p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Manage Orders</div>
                    <div className="text-[10px] text-stone-400">Update fulfillment status</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isOrderDetailOpen}
        onClose={() => setIsOrderDetailOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Add Product Modal */}
      <ProductFormModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSubmit={handleCreateProduct}
        title="Add New Product"
      />
    </div>
  );
};
