import { useRef } from 'react';
import { Upload, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useActor } from '../hooks/useActor';

interface VideoFilePickerProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onStartUpload: () => void;
  disabled?: boolean;
}

export default function VideoFilePicker({ 
  onFileSelect, 
  selectedFile, 
  onStartUpload,
  disabled 
}: VideoFilePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { actor, isFetching } = useActor();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      onFileSelect(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const isActorReady = !!actor && !isFetching;
  const uploadDisabled = disabled || !isActorReady;

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          Select Video File
        </CardTitle>
        <CardDescription>
          Choose a video file to remove watermarks. Supports MP4, MOV, AVI, and other common formats.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/30"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Click to browse or drag and drop your video file
          </p>
          <p className="text-xs text-muted-foreground">
            Supports both short and long video files
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        {selectedFile && (
          <div className="bg-accent/30 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={onStartUpload}
              disabled={uploadDisabled}
              className="w-full"
              size="lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              {!isActorReady ? 'Connecting… please wait' : 'Start Upload'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
