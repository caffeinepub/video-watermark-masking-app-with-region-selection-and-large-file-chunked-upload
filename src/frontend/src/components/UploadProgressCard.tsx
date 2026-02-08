import { useEffect, useState } from 'react';
import { Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useChunkedVideoUpload } from '../hooks/useChunkedVideoUpload';
import { useActor } from '../hooks/useActor';

interface UploadProgressCardProps {
  fileName: string;
  progress: number;
  onProgressUpdate: (progress: number) => void;
  file: File;
  onComplete: (videoId: string) => void;
  onCancel: () => void;
}

export default function UploadProgressCard({ 
  fileName, 
  progress,
  onProgressUpdate,
  file,
  onComplete,
  onCancel
}: UploadProgressCardProps) {
  const { upload, retry, cancel, isUploading, uploadProgress, error } = useChunkedVideoUpload();
  const { actor, isFetching } = useActor();
  const [hasStarted, setHasStarted] = useState(false);

  const isActorReady = !!actor && !isFetching;

  useEffect(() => {
    onProgressUpdate(uploadProgress);
  }, [uploadProgress, onProgressUpdate]);

  useEffect(() => {
    // Only start upload once actor is ready and we haven't started yet
    if (isActorReady && !hasStarted && !error) {
      setHasStarted(true);
      const startUpload = async () => {
        const videoId = await upload(file);
        if (videoId) {
          onComplete(videoId);
        }
      };
      startUpload();
    }
  }, [isActorReady, hasStarted, file, upload, onComplete, error]);

  const handleCancel = () => {
    cancel();
    onCancel();
  };

  const handleRetry = async () => {
    const videoId = await retry(file);
    if (videoId) {
      onComplete(videoId);
    }
  };

  const getPhaseText = () => {
    if (!isActorReady) return 'Connecting to backend...';
    if (error) return 'Upload failed';
    if (progress === 100) return 'Upload complete';
    if (progress > 0) return 'Uploading...';
    return 'Preparing upload...';
  };

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {error ? (
              <AlertCircle className="w-5 h-5 text-destructive" />
            ) : progress === 100 ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            )}
            Upload Progress
          </span>
          {progress < 100 && !error && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">{fileName}</span>
            <span className="font-medium text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <p className="text-sm text-muted-foreground">{getPhaseText()}</p>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 space-y-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              onClick={handleRetry}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Retry Upload
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
