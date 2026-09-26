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
  TrendingUp,
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <span>Dashboard Overview</span>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold tracking-wide uppercase">
              Live Data
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time performance metrics and store management overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-950/50 flex items-center gap-2 transition-all shrink-0"
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
            <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
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
              iconBg="bg-amber-500/10"
              iconColor="text-amber-400"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              subtitle={`${stats.paidOrdersCount} paid orders`}
              icon={<ShoppingBag className="w-6 h-6" />}
              iconBg="bg-blue-500/10"
              iconColor="text-blue-400"
            />
            <StatCard
              title="Pending Orders"
              value={stats.pendingOrders}
              subtitle="Awaiting processing/payment"
              icon={<Clock className="w-6 h-6" />}
              iconBg="bg-amber-500/10"
              iconColor="text-amber-400"
            />
            <StatCard
              title="Total Revenue"
              value={formatNaira(stats.totalRevenue)}
              subtitle="Sum of completed paid orders"
              icon={<Banknote className="w-6 h-6" />}
              iconBg="bg-emerald-500/10"
              iconColor="text-emerald-400"
            />
          </>
        )}
      </div>

      {/* Recent Orders & Quick Shortcuts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (2 cols on lg) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md flex flex-col">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-100 text-lg">Recent Orders</h3>
              <p className="text-xs text-slate-400">Last 5 customer orders received</p>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
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
              <div className="p-12 text-center text-xs text-slate-500">
                No customer orders placed yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-6">Order</th>
                    <th className="py-3 px-6">Phone</th>
                    <th className="py-3 px-6">Total</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {stats.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsOrderDetailOpen(true);
                      }}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-6 font-mono font-bold text-slate-200">
                        #{order.id.substring(0, 8)}
                      </td>
                      <td className="py-3.5 px-6 text-slate-300">
                        {order.phone_number || 'N/A'}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-amber-400">
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
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800"
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
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
            <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Quick Actions</span>
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="w-full p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">Add New Product</div>
                    <div className="text-[10px] text-slate-400">Upload item to store</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">Manage Catalog</div>
                    <div className="text-[10px] text-slate-400">Edit prices & inventory</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/orders')}
                className="w-full p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">Manage Orders</div>
                    <div className="text-[10px] text-slate-400">Update fulfillment status</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
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
