import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '../../context/AuthContext';
import {apiService} from '../../services/ApiService';
import { ExternalProductResponse } from '@/models/external/ProductModels';
import FeatureMapTable from '../../components/FeatureMapTable';
import { productService } from '@/services/ProductService';
import { ProductDetailSeller } from '@/models/internal/Product';
import Product3DViewer from '../../components/Product3DViewer';
import ProductPreview from '@/components/ProductPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: string;
  images: string[];
  discount: number;
  discountValidUntil: string;
  model3dUrl?: string;
  featureMap?: { [key: string]: string };
}

interface SellerProductFormProps {
  mode?: 'create' | 'update';
}

const SellerProductForm: React.FC<SellerProductFormProps> = ({ mode }) => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { isSeller, user } = useAuth();
  const isEditing = mode === 'update' || Boolean(productId);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId: '',
    images: [],
    discount: 0,
    discountValidUntil: '',
    model3dUrl: '',
    featureMap: {},
  });

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isSeller) {
      navigate('/');
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        setCategories(response || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories.',
          variant: 'destructive',
        });
      }
    };

    fetchCategories();

    if (isEditing && productId) {
      const fetchProduct = async () => {
        try {
          const response = await productService.getSellerProductDetailsById(productId) as ProductDetailSeller;
      
          const transformedResponse: ProductFormData = {
            name: response.name,
            description: response.description,
            price: response.price,
            quantity: response.quantity,
            categoryId: response.category?.id || '',
            images: response.imageUrls || [],
            discount: response.discount || 0,
            discountValidUntil: response.discountValidUntil
              ? (typeof response.discountValidUntil === 'string'
                  ? response.discountValidUntil
                  : (response.discountValidUntil as Date).toISOString().slice(0, 10))
              : '',
            model3dUrl: response.model3dUrl || 'https://res.cloudinary.com/df4kum9dh/image/upload/v1750175561/Ramsebo_Wing_Chair_Glb_rcthto.glb',
            featureMap: response.featureMap || {},
          };
      
          setFormData(transformedResponse);
        } catch (error) {
          console.error('Error loading product:', error);
          toast({
            title: 'Error',
            description: 'Failed to load product details.',
            variant: 'destructive',
          });
        }
      };

      fetchProduct();
    }
  }, [isSeller, navigate, isEditing, productId]);

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      try {
        const imageUrls: string[] = [];

        for (const file of Array.from(files)) {
          const response = await apiService.uploadImage(file);
          imageUrls.push(response.url);
        }

        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...imageUrls],
        }));

        toast({
          title: 'Images Uploaded',
          description: 'Your images have been uploaded successfully.',
        });
      } catch (error) {
        console.error('Error uploading images:', error);
        toast({
          title: 'Error',
          description: 'Failed to upload images. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // 3D Model upload handler
  const handle3DModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      try {
        const response = await apiService.uploadImage(files[0]); // Reuse image upload for 3D model
        setFormData(prev => ({
          ...prev,
          model3dUrl: response.url,
        }));
        toast({
          title: '3D Model Uploaded',
          description: 'Your 3D model has been uploaded successfully.',
        });
      } catch (error) {
        console.error('Error uploading 3D model:', error);
        toast({
          title: 'Error',
          description: 'Failed to upload 3D model. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const requestBody = {
        ...formData,
        company_id: user?.companyId, // Pass the company ID from the authenticated user
      };

      if (isEditing) {
        await apiService.updateProduct(user?.companyId || '', productId || '', requestBody);
        toast({
          title: 'Product Updated',
          description: 'Your product has been updated successfully.',
        });
      } else {
        await apiService.createProduct(user?.companyId || '', requestBody);
        toast({
          title: 'Product Created',
          description: 'Your product has been created successfully.',
        });
      }

      navigate('/seller/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add drag-and-drop functionality for image reordering
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (
      dragItem.current !== null &&
      dragOverItem.current !== null &&
      dragItem.current !== dragOverItem.current
    ) {
      setFormData((prev) => {
        const images = [...prev.images];
        const draggedImage = images[dragItem.current!];
        images.splice(dragItem.current!, 1);
        images.splice(dragOverItem.current!, 0, draggedImage);
        return { ...prev, images };
      });
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-cream pt-24">
        <div className="container-custom py-8">
          {/* Product Preview Button */}
          <div className="flex justify-end mb-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowPreview(true)}
            >
              Product Preview Page
            </Button>
          </div>
          {showPreview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={() => setShowPreview(false)}
                >
                  ×
                </Button>
                <ProductPreview
                  product={{
                    id: productId || 'preview-id',
                    name: formData.name || 'Product Name',
                    company: { id: user?.companyId || 'company-id', name: 'Company Name', email: user?.email || 'company@email.com', address: '123 Main St' },
                    averageRating: 4.5,
                    totalRatings: 12,
                    category: { id: formData.categoryId || 'cat-id', name: (categories.find(c => c._id === formData.categoryId)?.name) || 'Category' },
                    price: formData.price,
                    discount: formData.discount,
                    quantity: formData.quantity,
                    description: formData.description || 'Product description...',
                    imageUrls: formData.images,
                    images: formData.images,
                    displayImage: formData.images[0] || '/placeholder.svg',
                    interactions: { likes: 0, comments: [], shares: 0, userHasLiked: false, userHasShared: false },
                    version: 1,
                    featureMap: formData.featureMap || {},
                    model3dUrl: formData.model3dUrl,
                  }}
                  userRole="seller"
                  isPreview={true}
                />
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/seller/products')}
              className="mr-4 text-charcoal hover:text-terracotta"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="font-playfair text-3xl text-charcoal mb-2">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-earth">
                {isEditing ? 'Update your product details' : 'Create a new product listing'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="bg-white border-taupe/20">
              <CardHeader>
                <CardTitle className="text-charcoal">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your product..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => handleInputChange('categoryId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="quantity">Stock Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => handleInputChange('discount', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="discountValidUntil">Discount Valid Until</Label>
                    <Input
                      id="discountValidUntil"
                      type="date"
                      value={formData.discountValidUntil}
                      onChange={(e) => handleInputChange('discountValidUntil', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="bg-white border-taupe/20">
              <CardHeader>
                <CardTitle className="text-charcoal">Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="images">Upload Images</Label>
                    <div className="mt-2">
                      <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image')?.click()}
                        className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white"
                      >
                        <Upload size={16} className="mr-2" />
                        Upload Images
                      </Button>
                    </div>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative group cursor-move"
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragEnter={() => handleDragEnter(index)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => e.preventDefault()}
                          tabIndex={0}
                        >
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 3D Model Upload */}
            <Card className="bg-white border-taupe/20">
              <CardHeader>
                <CardTitle className="text-charcoal">Product 3D Model</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="model3d">Upload 3D Model File</Label>
                  <input
                    id="model3d-file"
                    type="file"
                    accept=".glb,.gltf,.obj,.fbx"
                    onChange={handle3DModelUpload}
                    style={{ display: 'none' }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('model3d-file')?.click()}
                    className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white"
                  >
                    <Upload size={16} className="mr-2" />
                    Upload 3D Model File
                  </Button>
                  {formData.model3dUrl && (
                    <div className="mt-4 flex flex-col gap-2">
                      <Product3DViewer productName={formData.name || 'Product'} className="w-full" url={formData.model3dUrl} />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, model3dUrl: '' }))}
                        className="w-fit"
                      >
                        Remove 3D Model
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Feature Map Table */}
            <Card className="bg-white border-taupe/20">
              <CardHeader>
                <CardTitle className="text-charcoal">Product Features</CardTitle>
              </CardHeader>
              <CardContent>
                <FeatureMapTable
                  featureMap={formData.featureMap || {}}
                  onChange={(newMap) => handleInputChange('featureMap', newMap)}
                />
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/seller/products')}
                className="flex-1 md:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 md:flex-none bg-terracotta hover:bg-umber text-white"
              >
                {isLoading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SellerProductForm;