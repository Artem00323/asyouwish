'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { PlusCircle, Link, Upload, RussianRuble } from 'lucide-react';

interface ItemData {
  name: string;
  image?: string | File;
  price: number;
  description: string;
}

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: ItemData) => void;
}

export function AddItemModal({ isOpen, onClose, onAddItem }: AddItemModalProps) {
  const [manualData, setManualData] = useState<ItemData>({ name: '', price: 0, description: '' });
  const [linkData, setLinkData] = useState('');
  const [parsedItem, setParsedItem] = useState<ItemData | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [price, setPrice] = useState<string>('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

  useEffect(() => {
    return () => {
      // Cleanup URL when component unmounts
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setManualData((prev) => ({ ...prev, image: file }));
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleManualDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setManualData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleAddManualItem = () => {
    if (manualData.name && manualData.price > 0) {
      onAddItem(manualData);
      onClose();
    } else {
      window.alert('Validation Error: Please fill in all the required fields correctly.');
    }
  };

  const handleLinkDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkData(e.target.value);
  };

  const handleParseLink = async () => {
    if (!linkData) {
      window.alert('Error: Please enter a product URL.');
      return;
    }

    setIsParsing(true);
    setParsedItem(null);

    try {
      const response = await fetch('/api/parse-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: linkData }),
      });

      const data = await response.json();

      if (response.ok) {
        setParsedItem(data);
        setManualData({
          name: data.name,
          image: data.image,
          price: data.price,
          description: data.description,
        });
      } else {
        window.alert(data.error || 'Failed to parse the product URL.');
      }
    } catch (error) {
      console.error('Error parsing link:', error);
      window.alert('Error: An unexpected error occurred while parsing the link.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleAddParsedItem = () => {
    if (parsedItem) {
      onAddItem(parsedItem);
      onClose();
    }
  };

  const toggleShowMore = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncateDescription = (description: string, length: number) => {
    if (description.length <= length) return description;
    return description.substring(0, length) + '...';
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setPrice(value);
      setManualData(prev => ({
        ...prev,
        price: value === '' ? 0 : Number(value)
      }));
    }
  };

  const handleRemoveImage = () => {
    setManualData(prev => ({ ...prev, image: undefined }));
    setImagePreviewUrl('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Item</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="manual" className="text-sm">Manual Add</TabsTrigger>
            <TabsTrigger value="link" className="text-sm">Link API Add</TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <Card className="border-none shadow-none">
              <CardContent className="space-y-6 p-0">
                {/* Manual Add Content */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Product Name</Label>
                  <Input id="name" name="name" value={manualData.name} onChange={handleManualDataChange} className="border-gray-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-medium">Upload Image</Label>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="image-upload" className="cursor-pointer flex items-center bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700">
                      <Upload className="w-5 h-5 text-white mr-2" />
                      <span>Choose Image</span>
                    </Label>
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  {manualData.image && imagePreviewUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative w-32 h-32"
                    >
                      <div className="absolute -right-2 -top-2 z-10">
                        <button
                          onClick={handleRemoveImage}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                      <Image
                        src={imagePreviewUrl}
                        alt={manualData.name}
                        width={128}
                        height={128}
                        className="rounded-md object-cover w-32 h-32"
                      />
                    </motion.div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">Price (₽)</Label>
                  <div className="relative">
                    <RussianRuble className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="price"
                      name="price"
                      type="text"
                      value={price}
                      onChange={handlePriceChange}
                      min="0"
                      step="any"
                      className="pl-10 border-gray-300"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={manualData.description}
                    onChange={handleManualDataChange}
                    className="border-gray-300 min-h-[100px]"
                  />
                </div>
                <Button onClick={handleAddManualItem} className="w-full hover:bg-gray-700">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="link">
            {/* Link API Add content - Added scrollable container */}
            <div className="max-h-[400px] overflow-y-auto px-4"> {/* Added padding to prevent content overlap */}
              <Card className="border-none shadow-none">
                <CardContent className="space-y-6 p-0">
                  <div className="space-y-2">
                    <Label htmlFor="productLink" className="text-sm font-medium">Product Link</Label>
                    <Input id="productLink" value={linkData} onChange={handleLinkDataChange} className="border-gray-300" />
                  </div>
                  <Button onClick={handleParseLink} className="w-full hover:bg-gray-700" disabled={isParsing}>
                    {isParsing ? 'Parsing...' : <><Link className="mr-2 h-4 w-4" /> Parse Link</>}
                  </Button>
                  <AnimatePresence>
                    {parsedItem && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="mt-4 border border-gray-200">
                          <CardContent className="p-4">
                            <div className="relative w-full h-40 mb-4 overflow-hidden rounded-md">
                              <Image
                                src={typeof parsedItem.image === 'string' 
                                    ? parsedItem.image 
                                    : parsedItem.image instanceof File 
                                        ? URL.createObjectURL(parsedItem.image) 
                                        : ''}
                                alt={parsedItem.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{parsedItem.name}</h3>
                            <p className="text-sm text-violet-600 font-medium mb-2">{parsedItem.price.toFixed(2)}₽</p>
                            <p className="text-sm text-gray-600">
                              {showFullDescription
                                ? parsedItem.description
                                : truncateDescription(parsedItem.description, 100)}
                              {parsedItem.description.length > 100 && (
                                <button className="text-violet-600 hover:text-violet-700 ml-1 focus:outline-none" onClick={toggleShowMore}>
                                  {showFullDescription ? 'Show less' : 'Show more'}
                                </button>
                              )}
                            </p>
                            <Button onClick={handleAddParsedItem} className="w-full mt-4 hover:bg-gray-700">
                              <PlusCircle className="mr-2 h-4 w-4" /> Add Parsed Item
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div> {/* End of scrollable container */}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
