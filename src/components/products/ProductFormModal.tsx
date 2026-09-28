import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Product, ProductFormData, PRODUCT_CATEGORIES } from '../../types';
import { Upload, X, Loader2, Image as ImageIcon, Plus } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ProductFormData) => Promise<boolean>;
  initialProduct?: Product | null;
  title: string;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialProduct,
  title,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Furniture');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || '');
      
      const isStandardCat = PRODUCT_CATEGORIES.includes(initialProduct.category as any);
      if (isStandardCat) {
        setCategory(initialProduct.category);
        setIsCustomCategory(false);
        setCustomCategory('');
      } else {
        setCategory('__custom__');
        setIsCustomCategory(true);
        setCustomCategory(initialProduct.category || '');
      }

      setPrice(initialProduct.price !== null && initialProduct.price !== undefined ? String(initialProduct.price) : '');
      setDescription(initialProduct.description || '');
      setImagePreview(initialProduct.image_url || null);
      setImageFile(null);
    } else {
      // Reset form
      setName('');
      setCategory('Furniture');
      setCustomCategory('');
      setIsCustomCategory(false);
      setPrice('');
      setDescription('');
      setImageFile(null);
      setImagePreview(null);
    }
    setFormError(null);
  }, [initialProduct, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormError('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setFormError('Image size exceeds 10MB limit.');
        return;
      }

      setImageFile(file);
      setFormError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategory(val);
    if (val === '__custom__') {
      setIsCustomCategory(true);
    } else {
      setIsCustomCategory(false);
      setCustomCategory('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Product name is required.');
      return;
    }

    if (isCustomCategory && !customCategory.trim()) {
      setFormError('Please specify the custom category name.');
      return;
    }

    setIsSubmitting(true);

    const formData: ProductFormData = {
      name,
      category: isCustomCategory ? '__custom__' : category,
      customCategory: isCustomCategory ? customCategory : undefined,
      price,
      description,
      imageFile,
    };

    const success = await onSubmit(formData);
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {formError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {formError}
          </div>
        )}

        {/* Product Name */}
        <div>
          <label className="block text-xs font-semibold text-[#4A4F4C] uppercase tracking-wider mb-2">
            Product Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Modern Velvet Accent Chair"
            className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E6E1] text-[#2C2C2C] placeholder-stone-400 focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e] text-sm transition-colors"
          />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A4F4C] uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={handleCategorySelectChange}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E6E1] text-[#2C2C2C] focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e] text-sm transition-colors cursor-pointer"
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__custom__">+ Add Custom Category...</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A4F4C] uppercase tracking-wider mb-2">
              Price (₦ Naira)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-stone-400 font-semibold text-sm">
                ₦
              </span>
              <input
                type="number"
                step="any"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150000"
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-white border border-[#E8E6E1] text-[#2C2C2C] placeholder-stone-400 focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e] text-sm transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Custom Category Input (if selected) */}
        {isCustomCategory && (
          <div className="animate-in fade-in duration-200">
            <label className="block text-xs font-semibold text-[#4A4F4C] uppercase tracking-wider mb-2">
              New Custom Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required={isCustomCategory}
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="e.g. Sculptures & Art"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E6E1] text-[#2C2C2C] placeholder-stone-400 focus:outline-none focus:border-[#c9a96e] text-sm"
            />
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-[#4A4F4C] uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of materials, dimensions, craftsmanship, and style..."
            className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E6E1] text-[#2C2C2C] placeholder-stone-400 focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e] text-sm transition-colors resize-none"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-xs font-semibold text-[#4A4F4C] uppercase tracking-wider mb-2">
            Product Image (Supabase Storage: <code className="text-[#8B6F47] font-semibold">product-images</code>)
          </label>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Image Preview Box */}
            <div className="w-28 h-28 rounded-2xl bg-stone-100 border border-[#E8E6E1] overflow-hidden relative shrink-0 flex items-center justify-center group shadow-sm">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                  {imageFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(initialProduct?.image_url || null);
                      }}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors"
                      title="Clear uploaded image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center text-stone-400 p-2 text-center">
                  <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                  <span className="text-[10px]">No image</span>
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div className="flex-1 w-full">
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#E8E6E1] hover:border-[#c9a96e] bg-[#FAF9F7] hover:bg-white rounded-2xl cursor-pointer transition-all group">
                <Upload className="w-6 h-6 text-stone-400 group-hover:text-[#c9a96e] mb-2 transition-colors" />
                <span className="text-xs font-semibold text-[#2C2C2C]">
                  {imageFile ? imageFile.name : 'Click to select or drag image file'}
                </span>
                <span className="text-[10px] text-[#666666] mt-1">
                  Supports JPG, PNG, WEBP (Max 10MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E6E1] mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#2C2C2C] bg-stone-100 hover:bg-stone-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#c9a96e] hover:bg-[#8B6F47] text-white transition-all shadow-md shadow-[#c9a96e]/20 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#c9a96e] disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{initialProduct ? 'Save Changes' : 'Create Product'}</span>
          </button>
        </div>

      </form>
    </Modal>
  );
};
