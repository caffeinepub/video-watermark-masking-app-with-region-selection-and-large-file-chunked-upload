import { useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useVideoStatus } from '../hooks/useVideoStatus';
import { WatermarkRegion } from '../App';
import { VideoStatus } from '../backend';

interface ProcessingScreenProps {
  videoId: string;
  watermarkRegion: WatermarkRegion;
  onComplete: () => void;
  onRetry: () => void;
}

export default function ProcessingScreen({
  videoId,
  watermarkRegion,
  onComplete,
  onRetry
}: ProcessingScreenProps) {
  const { status, statusText, error, markWatermark, updateStatus } = useVideoStatus(videoId);

  useEffect(() => {
    const processVideo = async () => {
      // Mark the watermark region
      await markWatermark(
        Math.round(watermarkRegion.x),
        Math.round(watermarkRegion.y),
        Math.round(watermarkRegion.width),
        Math.round(watermarkRegion.height)
      );
      
      // Simulate processing
      await updateStatus(VideoStatus.processing);
      
      // Simulate completion after delay
      setTimeout(async () => {
        await updateStatus(VideoStatus.completed);
        onComplete();
      }, 3000);
    };
    
    processVideo();
  }, [videoId, watermarkRegion, markWatermark, updateStatus, onComplete]);

  const getStatusBadge = () => {
    switch (status) {
      case VideoStatus.processing:
        return <Badge className="bg-primary">Processing</Badge>;
      case VideoStatus.completed:
        return <Badge className="bg-chart-2">Completed</Badge>;
      case VideoStatus.failed:
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Queued</Badge>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {status === VideoStatus.completed ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : status === VideoStatus.failed ? (
                <AlertCircle className="w-5 h-5 text-destructive" />
              ) : (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              )}
              Processing Video
            </span>
            {getStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            {status === VideoStatus.processing && (
              <div className="space-y-4">
                <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
                <p className="text-lg font-medium text-foreground">{statusText}</p>
                <p className="text-sm text-muted-foreground">
                  This may take a few moments for longer videos...
                </p>
              </div>
            )}
            
            {status === VideoStatus.completed && (
              <div className="space-y-4">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
                <p className="text-lg font-medium text-foreground">Processing Complete!</p>
                <p className="text-sm text-muted-foreground">
                  Your video is ready for download.
                </p>
              </div>
            )}
            
            {status === VideoStatus.failed && (
              <div className="space-y-4">
                <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
                <p className="text-lg font-medium text-foreground">Processing Failed</p>
                <p className="text-sm text-muted-foreground">
                  {error || 'An error occurred during processing.'}
                </p>
              </div>
            )}
          </div>

          <Alert>
            <AlertDescription className="text-sm">
              <strong>Processing Details:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Watermark region: {Math.round(watermarkRegion.width)} × {Math.round(watermarkRegion.height)} px</li>
                <li>Position: ({Math.round(watermarkRegion.x)}, {Math.round(watermarkRegion.y)})</li>
                <li>AI reconstruction in progress</li>
              </ul>
            </AlertDescription>
          </Alert>

          {status === VideoStatus.failed && (
            <Button onClick={onRetry} className="w-full" variant="outline">
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
