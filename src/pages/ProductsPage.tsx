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
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-[#D4AF37]" />
            <span>Products Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 font-sans">
            Manage product inventory, pricing, descriptions, and high-res imagery.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-stone-300 hover:text-white hover:border-[#D4AF37]/40 transition-colors self-start sm:self-auto shadow-sm"
          title="Refresh products list"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#D4AF37]' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
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
