import { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WatermarkRegion } from '../App';

interface VideoWatermarkSelectorProps {
  videoUrl: string;
  onRegionChange: (region: WatermarkRegion | null) => void;
  region: WatermarkRegion | null;
}

export default function VideoWatermarkSelector({ 
  videoUrl, 
  onRegionChange,
  region 
}: VideoWatermarkSelectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        setVideoDimensions({
          width: video.videoWidth,
          height: video.videoHeight
        });
        
        // Set default region (center 30% of video)
        if (!region) {
          const defaultWidth = video.videoWidth * 0.3;
          const defaultHeight = video.videoHeight * 0.2;
          onRegionChange({
            x: (video.videoWidth - defaultWidth) / 2,
            y: (video.videoHeight - defaultHeight) / 2,
            width: defaultWidth,
            height: defaultHeight
          });
        }
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, [videoUrl, region, onRegionChange]);

  const getScaleFactor = () => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return 1;
    
    return container.offsetWidth / video.videoWidth;
  };

  const handleMouseDown = (e: React.MouseEvent, action: 'drag' | 'resize', handle?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (action === 'drag') {
      setIsDragging(true);
    } else if (action === 'resize' && handle) {
      setIsResizing(handle);
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!region || (!isDragging && !isResizing)) return;

    const scale = getScaleFactor();
    const deltaX = (e.clientX - dragStart.x) / scale;
    const deltaY = (e.clientY - dragStart.y) / scale;

    if (isDragging) {
      const newX = Math.max(0, Math.min(videoDimensions.width - region.width, region.x + deltaX));
      const newY = Math.max(0, Math.min(videoDimensions.height - region.height, region.y + deltaY));
      
      onRegionChange({
        ...region,
        x: newX,
        y: newY
      });
    } else if (isResizing) {
      let newRegion = { ...region };
      
      switch (isResizing) {
        case 'nw':
          newRegion.x = Math.max(0, region.x + deltaX);
          newRegion.y = Math.max(0, region.y + deltaY);
          newRegion.width = Math.max(50, region.width - deltaX);
          newRegion.height = Math.max(50, region.height - deltaY);
          break;
        case 'ne':
          newRegion.y = Math.max(0, region.y + deltaY);
          newRegion.width = Math.max(50, region.width + deltaX);
          newRegion.height = Math.max(50, region.height - deltaY);
          break;
        case 'sw':
          newRegion.x = Math.max(0, region.x + deltaX);
          newRegion.width = Math.max(50, region.width - deltaX);
          newRegion.height = Math.max(50, region.height + deltaY);
          break;
        case 'se':
          newRegion.width = Math.max(50, region.width + deltaX);
          newRegion.height = Math.max(50, region.height + deltaY);
          break;
      }
      
      // Ensure region stays within bounds
      if (newRegion.x + newRegion.width > videoDimensions.width) {
        newRegion.width = videoDimensions.width - newRegion.x;
      }
      if (newRegion.y + newRegion.height > videoDimensions.height) {
        newRegion.height = videoDimensions.height - newRegion.y;
      }
      
      onRegionChange(newRegion);
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(null);
  };

  const scale = getScaleFactor();

  return (
    <Card className="shadow-warm">
      <CardContent className="p-6">
        <div 
          ref={containerRef}
          className="relative w-full bg-black rounded-lg overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-auto"
            controls
          />
          
          {region && videoDimensions.width > 0 && (
            <div
              className="video-selector-overlay absolute"
              style={{
                left: `${region.x * scale}px`,
                top: `${region.y * scale}px`,
                width: `${region.width * scale}px`,
                height: `${region.height * scale}px`
              }}
              onMouseDown={(e) => handleMouseDown(e, 'drag')}
            >
              {/* Resize handles */}
              <div
                className="resize-handle"
                style={{ top: '-6px', left: '-6px', cursor: 'nw-resize' }}
                onMouseDown={(e) => handleMouseDown(e, 'resize', 'nw')}
              />
              <div
                className="resize-handle"
                style={{ top: '-6px', right: '-6px', cursor: 'ne-resize' }}
                onMouseDown={(e) => handleMouseDown(e, 'resize', 'ne')}
              />
              <div
                className="resize-handle"
                style={{ bottom: '-6px', left: '-6px', cursor: 'sw-resize' }}
                onMouseDown={(e) => handleMouseDown(e, 'resize', 'sw')}
              />
              <div
                className="resize-handle"
                style={{ bottom: '-6px', right: '-6px', cursor: 'se-resize' }}
                onMouseDown={(e) => handleMouseDown(e, 'resize', 'se')}
              />
            </div>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Drag the highlighted region to position it over the watermark. Use the corner handles to resize.
        </p>
      </CardContent>
    </Card>
  );
}
