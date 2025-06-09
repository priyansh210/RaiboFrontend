import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
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

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category_id: string;
  images: string[];
  discount: number;
  discountValidUntil: string;
}

const SellerProductForm = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { isSeller, user } = useAuth();
  const isEditing = Boolean(productId);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category_id: '',
    images: [],
    discount: 0,
    discountValidUntil: '',
  });

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
          const response = await apiService.getProductById(productId) as ExternalProductResponse;
      
          const transformedResponse: ProductFormData = {
            name: response.name,
            description: response.description,
            price: response.price,
            quantity: response.quantity,
            category_id: response.category_id?._id || '',
            images: response.images || [],
            discount: response.discount || 0,
            discountValidUntil: response.discount_valid_until || '',
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

  return (
    <Layout>
      <div className="min-h-screen bg-cream pt-24">
        <div className="container-custom py-8">
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
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange('category_id', value)}
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
                        onClick={() => document.getElementById('images')?.click()}
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
                        <div key={index} className="relative group">
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