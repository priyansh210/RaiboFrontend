
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import { Product, ProductColor } from '../models/internal/Product';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: string;
  images: string[];
  discount: number;
  discountValidUntil: string;
  colors: ProductColor[];
  featured: boolean;
  new: boolean;
  bestSeller: boolean;
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
    categoryId: '',
    images: [],
    discount: 0,
    discountValidUntil: '',
    colors: [],
    featured: false,
    new: false,
    bestSeller: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [newColor, setNewColor] = useState({ name: '', code: '#000000' });

  const categories = [
    { id: '1', name: 'Furniture' },
    { id: '2', name: 'Outdoor' },
    { id: '3', name: 'Bedding & Bath' },
    { id: '4', name: 'Rugs' },
    { id: '5', name: 'Decor & Pillows' },
    { id: '6', name: 'Lighting' },
    { id: '7', name: 'Organization' },
    { id: '8', name: 'Kitchen' },
    { id: '9', name: 'Home Improvement' },
  ];

  useEffect(() => {
    if (!isSeller) {
      navigate('/');
      return;
    }

    if (isEditing && productId) {
      // TODO: Load existing product data
      console.log('Loading product for editing:', productId);
    }
  }, [isSeller, navigate, isEditing, productId]);

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // TODO: Implement actual image upload
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addColor = () => {
    if (newColor.name && newColor.code) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }));
      setNewColor({ name: '', code: '#000000' });
    }
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement actual product creation/update
      console.log('Submitting product:', formData);
      
      toast({
        title: isEditing ? "Product updated" : "Product created",
        description: `Your product has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });

      navigate('/seller/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
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

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

            {/* Colors */}
            <Card className="bg-white border-taupe/20">
              <CardHeader>
                <CardTitle className="text-charcoal">Available Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Color name"
                      value={newColor.name}
                      onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <input
                      type="color"
                      value={newColor.code}
                      onChange={(e) => setNewColor(prev => ({ ...prev, code: e.target.value }))}
                      className="w-16 h-10 border border-taupe/30 rounded"
                    />
                    <Button type="button" onClick={addColor} variant="outline">
                      <Plus size={16} />
                    </Button>
                  </div>

                  {formData.colors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.colors.map((color, index) => (
                        <div key={index} className="flex items-center gap-2 bg-linen px-3 py-1 rounded-full">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color.code }}
                          />
                          <span className="text-sm">{color.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeColor(index)}
                            className="h-auto p-1"
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Discount & Promotional */}
            <Card className="bg-white border-taupe/20">
              <CardHeader>
                <CardTitle className="text-charcoal">Promotional Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked)}
                    />
                    <Label htmlFor="featured">Featured Product</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new"
                      checked={formData.new}
                      onCheckedChange={(checked) => handleInputChange('new', checked)}
                    />
                    <Label htmlFor="new">New Product</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bestSeller"
                      checked={formData.bestSeller}
                      onCheckedChange={(checked) => handleInputChange('bestSeller', checked)}
                    />
                    <Label htmlFor="bestSeller">Best Seller</Label>
                  </div>
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
