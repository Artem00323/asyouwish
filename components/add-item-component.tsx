'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { PlusCircle, Link } from 'lucide-react';

interface ItemData {
  name: string;
  image: string | File;
  price: number;
  description: string;
}

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: ItemData) => void;
}

export function AddItemModal({ isOpen, onClose, onAddItem }: AddItemModalProps) {
  const [manualData, setManualData] = useState<ItemData>({ name: '', image: '', price: 0, description: '' });
  const [linkData, setLinkData] = useState('');
  const [parsedItem, setParsedItem] = useState<ItemData | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Handle image upload for manual add
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setManualData((prev) => ({ ...prev, image: e.target.files![0] }));
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
    if (manualData.name && manualData.price > 0 && manualData.image) {
      onAddItem(manualData);
      onClose();
    } else {
      alert('Please fill in all the required fields correctly.');
    }
  };

  const handleLinkDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkData(e.target.value);
  };

  const handleParseLink = async () => {
    if (!linkData) {
      alert('Please enter a product URL.');
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
        // Automatically populate the manual form when switching from Link API Add
        setManualData({
          name: data.name,
          image: data.image,
          price: data.price,
          description: data.description,
        });
      } else {
        alert(data.error || 'Failed to parse the product URL.');
      }
    } catch (error) {
      console.error('Error parsing link:', error);
      alert('An unexpected error occurred while parsing the link.');
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="manual">Manual Add</TabsTrigger>
            <TabsTrigger value="link">Link API Add</TabsTrigger>
          </TabsList>

          {/* Scrollable content for Manual Add */}
          <TabsContent value="manual">
            <Card className="max-h-[400px] overflow-y-auto p-4 rounded-lg">
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" value={manualData.name} onChange={handleManualDataChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Upload Image</Label>
                  <Input id="image" name="image" type="file" onChange={handleImageUpload} />
                  {manualData.image && typeof manualData.image !== 'string' && (
                    <Image
                      src={URL.createObjectURL(manualData.image)}
                      alt={manualData.name}
                      width={100}
                      height={100}
                      className="rounded-md mt-2"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₽)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={manualData.price}
                    onChange={handleManualDataChange}
                    min="0"
                    step="any"
                    className="pl-8"
                    placeholder="₽"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={manualData.description}
                    onChange={handleManualDataChange}
                  />
                </div>
                <Button onClick={handleAddManualItem} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scrollable content for Link API Add */}
          <TabsContent value="link">
            <Card className="max-h-[400px] overflow-y-auto p-4 rounded-lg">
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productLink">Product Link</Label>
                  <Input id="productLink" value={linkData} onChange={handleLinkDataChange} />
                </div>
                <Button onClick={handleParseLink} className="w-full" disabled={isParsing}>
                  {isParsing ? 'Parsing...' : <><Link className="mr-2 h-4 w-4" /> Parse Link</>}
                </Button>
                {parsedItem && (
                  <Card className="mt-4">
                    <CardContent className="pt-4">
                      <div className="relative w-full h-48 mb-4">
                        <Image
                          src={parsedItem.image}
                          alt={parsedItem.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded-md"
                        />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{parsedItem.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">${parsedItem.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {showFullDescription
                          ? parsedItem.description
                          : truncateDescription(parsedItem.description, 100)}
                        {parsedItem.description.length > 100 && (
                          <span className="text-blue-500 cursor-pointer" onClick={toggleShowMore}>
                            {showFullDescription ? ' Show less' : ' Show more'}
                          </span>
                        )}
                      </p>
                      <Button onClick={handleAddParsedItem} className="w-full mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Parsed Item
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
