import { Trash2, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMyVideos } from '../hooks/useQueries';
import { VideoStatus } from '../backend';

interface MyUploadsSectionProps {
  onVideoSelect: (videoId: string) => void;
}

export default function MyUploadsSection({ onVideoSelect }: MyUploadsSectionProps) {
  const { data: videos, isLoading } = useMyVideos();
  const { deleteVideo } = useMyVideos();

  if (isLoading) {
    return null;
  }

  const activeVideos = videos?.filter(v => v.status !== VideoStatus.deleted) || [];

  if (activeVideos.length === 0) {
    return null;
  }

  const getStatusBadge = (status: VideoStatus) => {
    switch (status) {
      case VideoStatus.uploaded:
        return <Badge variant="secondary">Uploaded</Badge>;
      case VideoStatus.processing:
        return <Badge className="bg-primary">Processing</Badge>;
      case VideoStatus.completed:
        return <Badge className="bg-chart-2">Completed</Badge>;
      case VideoStatus.failed:
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          My Uploads
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeVideos.map((video) => (
            <div
              key={video.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {video.fileName}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(Number(video.uploadedAt) / 1000000).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                {getStatusBadge(video.status)}
                
                {video.status === VideoStatus.uploaded && (
                  <Button
                    size="sm"
                    onClick={() => onVideoSelect(video.id)}
                  >
                    Continue
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteVideo(video.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
