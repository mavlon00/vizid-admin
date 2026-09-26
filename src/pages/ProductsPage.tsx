import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductTable } from '../components/products/ProductTable';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { DeleteProductModal } from '../components/products/DeleteProductModal';
import { useToast } from '../hooks/useToast';
import { Product, ProductFormData } from '../types';
import { Package, RefreshCw } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { products, isLoading, error, refetch, addProduct, updateProduct, deleteProduct } =
    useProducts();
  const { showSuccess, showError } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateProduct = async (formData: ProductFormData): Promise<boolean> => {
    const res = await addProduct(formData);
    if (res.success) {
      showSuccess('Product Added', `"${formData.name}" was added successfully.`);
      return true;
    } else {
      showError('Failed to Create Product', res.error);
      return false;
    }
  };

  const handleUpdateProduct = async (formData: ProductFormData): Promise<boolean> => {
    if (!editingProduct) return false;
    const res = await updateProduct(editingProduct.id, formData, editingProduct);
    if (res.success) {
      showSuccess('Product Updated', `"${formData.name}" changes saved.`);
      setEditingProduct(null);
      return true;
    } else {
      showError('Update Failed', res.error);
      return false;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    const res = await deleteProduct(deletingProduct);
    setIsDeleting(false);

    if (res.success) {
      showSuccess('Product Deleted', `"${deletingProduct.name}" removed from catalog.`);
      setDeletingProduct(null);
    } else {
      showError('Delete Failed', res.error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <Package className="w-7 h-7 text-amber-400" />
            <span>Products Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage product inventory, pricing, descriptions, and high-res imagery.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors self-start sm:self-auto"
          title="Refresh products list"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Main Table */}
      <ProductTable
        products={products}
        isLoading={isLoading}
        onEdit={(prod) => setEditingProduct(prod)}
        onDelete={(prod) => setDeletingProduct(prod)}
        onAddNew={() => setIsAddModalOpen(true)}
      />

      {/* Add Product Modal */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateProduct}
        title="Add New Product"
      />

      {/* Edit Product Modal */}
      <ProductFormModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSubmit={handleUpdateProduct}
        initialProduct={editingProduct}
        title={`Edit Product: ${editingProduct?.name || ''}`}
      />

      {/* Delete Confirmation Modal */}
      <DeleteProductModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
        product={deletingProduct}
        isDeleting={isDeleting}
      />
    </div>
  );
};
