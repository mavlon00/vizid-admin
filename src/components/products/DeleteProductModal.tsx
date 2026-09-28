import React from 'react';
import { Modal } from '../common/Modal';
import { Product } from '../../types';
import { formatNaira } from '../../lib/utils';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  product: Product | null;
  isDeleting: boolean;
}

export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  product,
  isDeleting,
}) => {
  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Product" maxWidth="md">
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-sm text-rose-900">Permanent Action</h4>
            <p>
              Are you sure you want to delete this product? This action cannot be undone and will immediately remove it from the public website storefront.
            </p>
          </div>
        </div>

        {/* Target Product Summary Card */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF9F7] border border-[#E8E6E1]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover shrink-0 bg-stone-100 border border-[#E8E6E1]"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-stone-100 border border-[#E8E6E1] flex items-center justify-center text-stone-400 shrink-0 text-xs">
              No Image
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-[#2C2C2C] text-sm truncate">{product.name}</h4>
            <p className="text-xs text-[#666666] mt-0.5">{product.category}</p>
            <p className="text-xs font-bold text-[#8B6F47] mt-1">
              {formatNaira(product.price)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E6E1]">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#2C2C2C] bg-stone-100 hover:bg-stone-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md shadow-rose-600/20 flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

