import { Download, PlayCircle, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DownloadPanelProps {
  videoId: string;
  onStartNew: () => void;
}

export default function DownloadPanel({ videoId, onStartNew }: DownloadPanelProps) {
  const handleDownload = () => {
    // In a real implementation, this would download the processed video
    console.log('Downloading video:', videoId);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-primary" />
            Your Processed Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <PlayCircle className="w-16 h-16 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Video preview</p>
            </div>
          </div>

          <Alert className="bg-accent/50 border-accent">
            <AlertDescription className="text-sm">
              <strong>Success!</strong> Your video has been processed. The watermark region has been reconstructed using AI.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button onClick={handleDownload} className="flex-1" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download Video
            </Button>
            
            <Button onClick={onStartNew} variant="outline" className="flex-1" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Process Another
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
