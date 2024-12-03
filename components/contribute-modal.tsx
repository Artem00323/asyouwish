import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RussianRuble } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemPrice: number;
  contributed: number;
  onContribute: (amount: number, message: string) => Promise<void>;
}

export function ContributeModal({
  isOpen,
  onClose,
  itemName,
  itemPrice,
  contributed,
  onContribute,
}: ContributeModalProps) {
  const [amount, setAmount] = useState('0');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemPriceNum = Number(itemPrice) || 0;
  const contributedNum = Number(contributed) || 0;
  const amountNum = Number(Number(amount).toFixed(2)) || 0;
  
  const remaining = Number((itemPriceNum - contributedNum).toFixed(2));
  const currentProgress = (contributedNum / itemPriceNum) * 100;

  const handleSliderChange = (value: number[]) => {
    setAmount(value[0].toString());
  };

  const handleSubmit = async () => {
    const contributionAmount = parseFloat(amount);
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (contributionAmount > remaining) {
      alert(`Maximum contribution amount is ${remaining}₽`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onContribute(contributionAmount, message);
      onClose();
    } catch {
      alert('Failed to process contribution');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] mx-auto sm:w-full max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>Contribute to {itemName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <div>
            <Progress value={currentProgress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {contributedNum.toFixed(2)}₽ raised of {itemPriceNum.toFixed(2)}₽
            </p>
            <p className="text-sm text-muted-foreground">
              Remaining: {Math.max(0, remaining).toFixed(2)}₽
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (₽)</label>
            <div className="space-y-4">
              <Slider
                value={[amountNum]}
                onValueChange={handleSliderChange}
                max={remaining}
                step={1}
                className="mb-2"
              />
              <div className="relative">
                <RussianRuble className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                  placeholder="Enter amount"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message (optional)</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message..."
              className="min-h-[100px]"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Contribute'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 