import { useState, useCallback, useRef } from 'react';
import { useUploadVideo } from './useQueries';

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

export function useChunkedVideoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const uploadVideoMutation = useUploadVideo();
  const abortControllerRef = useRef<AbortController | null>(null);

  const upload = useCallback(async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    // Create abort controller for this upload
    abortControllerRef.current = new AbortController();

    try {
      // Create video metadata in backend
      const videoId = await uploadVideoMutation.mutateAsync({
        fileName: file.name,
        contentType: file.type,
        size: file.size,
      });

      // Simulate chunked upload with progress
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      
      for (let i = 0; i < totalChunks; i++) {
        // Check if upload was cancelled
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Upload cancelled');
        }

        // Simulate chunk upload delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const progress = ((i + 1) / totalChunks) * 100;
        setUploadProgress(progress);
      }

      setIsUploading(false);
      abortControllerRef.current = null;
      return videoId;
    } catch (err) {
      let errorMessage = 'Upload failed';
      
      if (err instanceof Error) {
        // Check for access denied error
        if (err.message.includes('Invalid access secret') || err.message.includes('private')) {
          errorMessage = 'This app is private. Please use a valid access link.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setIsUploading(false);
      abortControllerRef.current = null;
      return null;
    }
  }, [uploadVideoMutation]);

  const retry = useCallback((file: File) => {
    setError(null);
    setUploadProgress(0);
    return upload(file);
  }, [upload]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    abortControllerRef.current = null;
  }, []);

  return {
    upload,
    retry,
    cancel,
    isUploading,
    uploadProgress,
    error,
  };
}
