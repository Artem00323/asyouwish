'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import { PlusCircle, Link } from 'lucide-react'

interface ItemData {
  name: string
  image: string
  price: number
  description: string
}

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onAddItem: (item: ItemData) => void
}

export function AddItemModal({ isOpen, onClose, onAddItem }: AddItemModalProps) {
  const [manualData, setManualData] = useState<ItemData>({ name: '', image: '', price: 0, description: '' })
  const [linkData, setLinkData] = useState('')
  const [parsedItem, setParsedItem] = useState<ItemData | null>(null)

  const handleManualDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setManualData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddManualItem = () => {
    if (manualData.name && manualData.price > 0) {
      onAddItem(manualData)
      onClose()
    }
  }

  const handleLinkDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkData(e.target.value)
  }

  const handleParseLink = () => {
    // Simulate fetching data from a link
    if (linkData) {
      const exampleParsedData: ItemData = {
        name: 'Sample Product',
        image: '/placeholder.svg?height=200&width=200',
        price: 399,
        description: 'A sample description of the parsed item',
      }
      setParsedItem(exampleParsedData)
    }
  }

  const handleAddParsedItem = () => {
    if (parsedItem) {
      onAddItem(parsedItem)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Add</TabsTrigger>
            <TabsTrigger value="link">Link API Add</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <Card>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" value={manualData.name} onChange={handleManualDataChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input id="image" name="image" value={manualData.image} onChange={handleManualDataChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={manualData.price}
                    onChange={handleManualDataChange}
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
          <TabsContent value="link">
            <Card>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="productLink">Product Link</Label>
                  <Input id="productLink" value={linkData} onChange={handleLinkDataChange} />
                </div>
                <Button onClick={handleParseLink} className="w-full">
                  <Link className="mr-2 h-4 w-4" /> Parse Link
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
                      <p className="text-sm text-muted-foreground">{parsedItem.description}</p>
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
  )
}