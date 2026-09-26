import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Product, ProductFormData } from '../types';
import { extractStoragePath } from '../lib/utils';
import { useAuth } from './useAuth';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchErr) {
        throw fetchErr;
      }

      setProducts(data as Product[]);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error('Could not generate public URL for uploaded image.');
    }

    return publicUrlData.publicUrl;
  };

  const addProduct = async (formData: ProductFormData): Promise<{ success: boolean; error?: string }> => {
    try {
      const categoryName = (
        formData.category === 'Custom' || formData.category === '__custom__'
          ? formData.customCategory?.trim()
          : formData.category
      ) || 'Furniture';

      const numericPrice = formData.price ? parseFloat(formData.price) : null;
      if (numericPrice !== null && (isNaN(numericPrice) || numericPrice < 0)) {
        return { success: false, error: 'Please enter a valid price amount.' };
      }

      let imageUrl: string | null = null;
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
      }

      const newProductPayload = {
        name: formData.name.trim(),
        category: categoryName,
        price: numericPrice,
        description: formData.description?.trim() || null,
        image_url: imageUrl,
        created_by: user?.id || null,
      };

      const { data, error: insertErr } = await supabase
        .from('products')
        .insert([newProductPayload])
        .select()
        .single();

      if (insertErr) {
        throw insertErr;
      }

      if (data) {
        setProducts((prev) => [data as Product, ...prev]);
      } else {
        await fetchProducts();
      }

      return { success: true };
    } catch (err: any) {
      console.error('Error adding product:', err);
      return { success: false, error: err.message || 'Failed to create product.' };
    }
  };

  const updateProduct = async (
    productId: string,
    formData: ProductFormData,
    existingProduct: Product
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const categoryName = (
        formData.category === 'Custom' || formData.category === '__custom__'
          ? formData.customCategory?.trim()
          : formData.category
      ) || existingProduct.category;

      const numericPrice = formData.price ? parseFloat(formData.price) : null;
      if (numericPrice !== null && (isNaN(numericPrice) || numericPrice < 0)) {
        return { success: false, error: 'Please enter a valid price amount.' };
      }

      let imageUrl = existingProduct.image_url;

      // Handle image upload if a new file is provided
      if (formData.imageFile) {
        const newImageUrl = await uploadImage(formData.imageFile);
        
        // Optionally remove old image if it existed in product-images bucket
        if (existingProduct.image_url) {
          const oldPath = extractStoragePath(existingProduct.image_url);
          if (oldPath) {
            await supabase.storage.from('product-images').remove([oldPath]).catch(() => {});
          }
        }
        imageUrl = newImageUrl;
      }

      const updatePayload = {
        name: formData.name.trim(),
        category: categoryName,
        price: numericPrice,
        description: formData.description?.trim() || null,
        image_url: imageUrl,
      };

      const { data, error: updateErr } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', productId)
        .select()
        .single();

      if (updateErr) {
        throw updateErr;
      }

      if (data) {
        setProducts((prev) => prev.map((p) => (p.id === productId ? (data as Product) : p)));
      } else {
        await fetchProducts();
      }

      return { success: true };
    } catch (err: any) {
      console.error('Error updating product:', err);
      return { success: false, error: err.message || 'Failed to update product.' };
    }
  };

  const deleteProduct = async (product: Product): Promise<{ success: boolean; error?: string }> => {
    try {
      // Delete record from products table
      const { error: deleteErr } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (deleteErr) {
        throw deleteErr;
      }

      // If product had an image in storage, remove it
      if (product.image_url) {
        const filePath = extractStoragePath(product.image_url);
        if (filePath) {
          const { error: storageErr } = await supabase.storage
            .from('product-images')
            .remove([filePath]);
          
          if (storageErr) {
            console.warn('Could not remove image file from storage:', storageErr);
          }
        }
      }

      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting product:', err);
      return { success: false, error: err.message || 'Failed to delete product.' };
    }
  };

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
