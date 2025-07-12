"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, CheckCircle, Recycle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-provider";

const AddItem = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // All hooks must be called at the top level
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: '',
    tags: ''
  });

  const [images, setImages] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [tagList, setTagList] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Recycle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const categories = [
    'Tops', 'Bottoms', 'Dresses', 'Jackets', 'Shoes', 'Accessories', 'Activewear', 'Formal'
  ];

  const types = {
    'Tops': ['T-Shirt', 'Blouse', 'Sweater', 'Tank Top', 'Cardigan'],
    'Bottoms': ['Jeans', 'Pants', 'Shorts', 'Skirt', 'Leggings'],
    'Dresses': ['Casual', 'Formal', 'Summer', 'Maxi', 'Mini'],
    'Jackets': ['Denim', 'Leather', 'Blazer', 'Coat', 'Windbreaker'],
    'Shoes': ['Sneakers', 'Boots', 'Heels', 'Flats', 'Sandals'],
    'Accessories': ['Bag', 'Hat', 'Jewelry', 'Scarf', 'Belt'],
    'Activewear': ['Sports Bra', 'Leggings', 'Workout Top', 'Shorts'],
    'Formal': ['Suit', 'Dress Shirt', 'Formal Dress', 'Blazer']
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12'];
  const conditions = ['Excellent', 'Good', 'Fair'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you'd upload these to a server
      // For demo, we'll use placeholder URLs
      const newImages = Array.from(files).map(() => 
        `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop&q=80`
      );
      setImages([...images, ...newImages.slice(0, 5 - images.length)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !tagList.includes(currentTag.trim()) && tagList.length < 5) {
      setTagList([...tagList, currentTag.trim().toLowerCase()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTagList(tagList.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          size: formData.size,
          condition: formData.condition,
          images: images,
          points: 0, // Default points
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const error = await response.json();
        console.error('Error creating item:', error);
        alert('Failed to create item. Please try again.');
      }
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Recycle className="h-8 w-8 text-green-600 dark:text-green-400" />
              <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">ReWear</h1>
            </Link>
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Item Submitted Successfully!</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Your item is under review and will be live on the platform once approved by our team.
            </p>
            <div className="space-y-4">
              <Button onClick={() => window.location.href = '/browse'} className="bg-green-600 hover:bg-green-700">
                Browse More Items
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                List Another Item
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-green-600 dark:text-green-400" />
            <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">ReWear</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Browse
            </Link>
            <Link href="/add-item" className="text-green-600 dark:text-green-400 font-medium">
              Add Item
            </Link>
            <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">List New Item</h1>
          <p className="text-gray-600 dark:text-gray-300">Share your unused clothing with the community</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300">Upload up to 5 high-quality photos of your item</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Add Photo</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Title *
                </label>
                <Input
                  placeholder="e.g., Vintage Denim Jacket - Classic Blue"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Description *
                </label>
                <Textarea
                  placeholder="Describe your item's condition, style, and any relevant details..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Category *
                  </label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value, type: ''})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Type *
                  </label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({...formData, type: value})}
                    disabled={!formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.category && types[formData.category as keyof typeof types]?.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Size *
                  </label>
                  <Select value={formData.size} onValueChange={(value) => setFormData({...formData, size: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map(size => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Condition *
                  </label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map(condition => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300">Add up to 5 tags to help others find your item</p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add a tag..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} disabled={tagList.length >= 5}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tagList.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    #{tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting || !formData.title || !formData.description || !formData.category || !formData.size || !formData.condition}
            >
              {isSubmitting ? 'Submitting...' : 'List Item'}
            </Button>
            <Button type="button" size="lg" variant="outline">
              Save as Draft
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
