import { ArrowLeft, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WatermarkRegion } from '../App';

interface WatermarkToolsPanelProps {
  region: WatermarkRegion | null;
  onRegionChange: (region: WatermarkRegion | null) => void;
  onConfirm: () => void;
  onReset: () => void;
  onBack: () => void;
  disabled?: boolean;
}

export default function WatermarkToolsPanel({
  region,
  onRegionChange,
  onConfirm,
  onReset,
  onBack,
  disabled
}: WatermarkToolsPanelProps) {
  const handleInputChange = (field: keyof WatermarkRegion, value: string) => {
    if (!region) return;
    
    const numValue = parseInt(value) || 0;
    onRegionChange({
      ...region,
      [field]: Math.max(0, numValue)
    });
  };

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle>Watermark Region Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {region && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="x">X Position</Label>
              <Input
                id="x"
                type="number"
                value={Math.round(region.x)}
                onChange={(e) => handleInputChange('x', e.target.value)}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="y">Y Position</Label>
              <Input
                id="y"
                type="number"
                value={Math.round(region.y)}
                onChange={(e) => handleInputChange('y', e.target.value)}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                value={Math.round(region.width)}
                onChange={(e) => handleInputChange('width', e.target.value)}
                min={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                value={Math.round(region.height)}
                onChange={(e) => handleInputChange('height', e.target.value)}
                min={50}
              />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button
            variant="outline"
            onClick={onReset}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button
            onClick={onConfirm}
            disabled={disabled}
            className="flex-1"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm & Process
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
