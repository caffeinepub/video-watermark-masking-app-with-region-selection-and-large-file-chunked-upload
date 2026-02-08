import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { VideoMetadata, VideoStatus } from '../backend';
import { useUnlistedAccess } from './useUnlistedAccess';

const ACCESS_DENIED_MESSAGE = 'This app is private. Please use a valid access link.';

export function useMyVideos() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const { getAccessSecret } = useUnlistedAccess();
  const queryClient = useQueryClient();

  const query = useQuery<VideoMetadata[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const secret = getAccessSecret();
      if (!secret) throw new Error(ACCESS_DENIED_MESSAGE);
      const principal = identity.getPrincipal();
      return actor.getAllVideosByOwner(secret, principal);
    },
    enabled: !!actor && !isFetching && !!identity,
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) throw new Error('Backend connection not ready. Please wait a moment and try again.');
      const secret = getAccessSecret();
      if (!secret) throw new Error(ACCESS_DENIED_MESSAGE);
      return actor.deleteVideo(secret, videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  return {
    ...query,
    deleteVideo: deleteVideoMutation.mutate,
  };
}

export function useVideo(videoId: string | null) {
  const { actor, isFetching } = useActor();
  const { getAccessSecret } = useUnlistedAccess();

  return useQuery<VideoMetadata | null>({
    queryKey: ['video', videoId],
    queryFn: async () => {
      if (!actor || !videoId) return null;
      const secret = getAccessSecret();
      if (!secret) throw new Error(ACCESS_DENIED_MESSAGE);
      return actor.getVideo(secret, videoId);
    },
    enabled: !!actor && !isFetching && !!videoId,
  });
}

export function useUploadVideo() {
  const { actor, isFetching } = useActor();
  const { getAccessSecret } = useUnlistedAccess();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fileName, contentType, size }: { fileName: string; contentType: string; size: number }) => {
      if (!actor) {
        throw new Error('Backend connection not ready. Please wait a moment and try again.');
      }
      const secret = getAccessSecret();
      if (!secret) throw new Error(ACCESS_DENIED_MESSAGE);
      return actor.uploadVideo(secret, fileName, contentType, BigInt(size));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

export function useMarkWatermark() {
  const { actor } = useActor();
  const { getAccessSecret } = useUnlistedAccess();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId, x, y, width, height }: { videoId: string; x: number; y: number; width: number; height: number }) => {
      if (!actor) throw new Error('Backend connection not ready. Please wait a moment and try again.');
      const secret = getAccessSecret();
      if (!secret) throw new Error(ACCESS_DENIED_MESSAGE);
      return actor.markWatermark(secret, videoId, BigInt(x), BigInt(y), BigInt(width), BigInt(height));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['video', variables.videoId] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

export function useUpdateVideoStatus() {
  const { actor } = useActor();
  const { getAccessSecret } = useUnlistedAccess();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId, status }: { videoId: string; status: VideoStatus }) => {
      if (!actor) throw new Error('Backend connection not ready. Please wait a moment and try again.');
      const secret = getAccessSecret();
      if (!secret) throw new Error(ACCESS_DENIED_MESSAGE);
      return actor.updateVideoStatus(secret, videoId, status);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['video', variables.videoId] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}
