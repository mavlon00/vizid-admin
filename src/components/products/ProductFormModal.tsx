import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Product, ProductFormData, PRODUCT_CATEGORIES } from '../../types';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

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
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {formError}
          </div>
        )}

        {/* Product Name */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
            Product Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Modern Velvet Accent Chair"
            className="w-full px-4 py-3 rounded-xl glass-input text-sm"
          />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={handleCategorySelectChange}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm cursor-pointer bg-[#141414] text-white"
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#141414] text-white">
                  {cat}
                </option>
              ))}
              <option value="__custom__" className="bg-[#141414] text-[#D4AF37]">+ Add Custom Category...</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Price (₦ Naira)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#D4AF37] font-semibold text-sm">
                ₦
              </span>
              <input
                type="number"
                step="any"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150000"
                className="w-full pl-9 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>
        </div>

        {/* Custom Category Input (if selected) */}
        {isCustomCategory && (
          <div className="animate-in fade-in duration-200">
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              New Custom Category Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required={isCustomCategory}
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="e.g. Sculptures & Art"
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
            />
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of materials, dimensions, craftsmanship, and style..."
            className="w-full px-4 py-3 rounded-xl glass-input text-sm resize-none"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
            Product Image (Supabase Storage: <code className="text-[#D4AF37] font-semibold">product-images</code>)
          </label>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Image Preview Box */}
            <div className="w-28 h-28 rounded-2xl bg-stone-900 border border-white/15 overflow-hidden relative shrink-0 flex items-center justify-center group shadow-sm">
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
                      className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-rose-600 text-white rounded-full transition-colors"
                      title="Clear uploaded image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center text-stone-500 p-2 text-center">
                  <ImageIcon className="w-8 h-8 mb-1 opacity-50 text-[#D4AF37]" />
                  <span className="text-[10px]">No image</span>
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div className="flex-1 w-full">
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/15 hover:border-[#D4AF37] bg-white/5 hover:bg-white/10 rounded-2xl cursor-pointer transition-all group">
                <Upload className="w-6 h-6 text-stone-400 group-hover:text-[#D4AF37] mb-2 transition-colors" />
                <span className="text-xs font-semibold text-white">
                  {imageFile ? imageFile.name : 'Click to select or drag image file'}
                </span>
                <span className="text-[10px] text-stone-400 mt-1">
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
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-sm font-medium btn-glass disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold text-black flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-black" />}
            <span>{initialProduct ? 'Save Changes' : 'Create Product'}</span>
          </button>
        </div>

      </form>
    </Modal>
  );
};
