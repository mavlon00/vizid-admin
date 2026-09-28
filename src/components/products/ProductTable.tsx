import React, { useState, useMemo } from 'react';
import { Product, PRODUCT_CATEGORIES } from '../../types';
import { formatNaira, formatDate } from '../../lib/utils';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Package,
  Layers,
} from 'lucide-react';
import { TableSkeleton } from '../common/Skeleton';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAddNew: () => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const availableCategories = useMemo(() => {
    const set = new Set<string>(['All', ...PRODUCT_CATEGORIES]);
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchTerm === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Glass Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
          />
        </div>

        {/* Filters & Add button */}
        <div className="flex items-center gap-3">
          {/* Category Dropdown Filter */}
          <div className="relative flex-1 sm:flex-none">
            <Filter className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2.5 rounded-xl glass-input text-xs sm:text-sm cursor-pointer appearance-none bg-white text-[#2C2C2C]"
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat} className="bg-white text-[#2C2C2C]">
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Add Product Button */}
          <button
            onClick={onAddNew}
            className="px-4 py-2.5 rounded-xl bg-[#c9a96e] hover:bg-[#8B6F47] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#c9a96e]/20 flex items-center gap-2 transition-all shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Glass Products Table Card */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={6} cols={5} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-[#E8E6E1] flex items-center justify-center mx-auto mb-4 text-stone-400">
              <Package className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#2C2C2C]">No products found</h3>
            <p className="text-xs text-[#666666] max-w-sm mx-auto mt-1">
              {products.length === 0
                ? 'Your product catalog is empty. Click "Add Product" to create your first item.'
                : 'No products match your current search and category filters.'}
            </p>
            {products.length > 0 && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-[#2C2C2C] transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8E6E1] bg-[#4A4F4C] text-[11px] font-bold uppercase tracking-wider text-white">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Added Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E1] text-sm">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[#FAF9F7] transition-colors group"
                  >
                    {/* Product info & image */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-stone-100 border border-[#E8E6E1] overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-stone-400" />
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <h4 className="font-semibold text-[#2C2C2C] text-sm truncate group-hover:text-[#8B6F47] transition-colors">
                            {product.name}
                          </h4>
                          {product.description && (
                            <p className="text-xs text-[#666666] line-clamp-1 mt-0.5">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#c9a96e]/10 border border-[#c9a96e]/30 text-[#8B6F47]">
                        <Layers className="w-3 h-3 text-[#c9a96e]" />
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 font-bold text-[#8B6F47]">
                      {formatNaira(product.price)}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-[#666666]">
                      {formatDate(product.created_at)}
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 rounded-xl text-stone-400 hover:text-[#8B6F47] hover:bg-[#c9a96e]/10 border border-transparent hover:border-[#c9a96e]/20 transition-all"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(product)}
                          className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

