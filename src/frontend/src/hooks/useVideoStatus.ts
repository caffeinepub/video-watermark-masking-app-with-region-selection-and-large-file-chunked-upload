import { useState, useCallback } from 'react';
import { useVideo } from './useQueries';
import { useMarkWatermark, useUpdateVideoStatus } from './useQueries';
import { VideoStatus } from '../backend';

export function useVideoStatus(videoId: string) {
  const { data: video } = useVideo(videoId);
  const markWatermarkMutation = useMarkWatermark();
  const updateStatusMutation = useUpdateVideoStatus();
  const [error, setError] = useState<string | null>(null);

  const status = video?.status || VideoStatus.uploaded;

  const getStatusText = useCallback(() => {
    switch (status) {
      case VideoStatus.uploaded:
        return 'Video uploaded, ready for processing';
      case VideoStatus.processing:
        return 'Processing video with AI reconstruction...';
      case VideoStatus.completed:
        return 'Processing complete';
      case VideoStatus.failed:
        return 'Processing failed';
      default:
        return 'Unknown status';
    }
  }, [status]);

  const markWatermark = useCallback(async (x: number, y: number, width: number, height: number) => {
    try {
      await markWatermarkMutation.mutateAsync({ videoId, x, y, width, height });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark watermark');
      throw err;
    }
  }, [videoId, markWatermarkMutation]);

  const updateStatus = useCallback(async (newStatus: VideoStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ videoId, status: newStatus });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      throw err;
    }
  }, [videoId, updateStatusMutation]);

  return {
    status,
    statusText: getStatusText(),
    error,
    markWatermark,
    updateStatus,
  };
}
