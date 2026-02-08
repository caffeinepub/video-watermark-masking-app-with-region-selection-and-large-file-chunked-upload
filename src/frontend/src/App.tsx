import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import AppLayout from './components/AppLayout';
import WorkflowHeader from './components/WorkflowHeader';
import VideoFilePicker from './components/VideoFilePicker';
import UploadProgressCard from './components/UploadProgressCard';
import VideoWatermarkSelector from './components/VideoWatermarkSelector';
import WatermarkToolsPanel from './components/WatermarkToolsPanel';
import ProcessingScreen from './components/ProcessingScreen';
import DownloadPanel from './components/DownloadPanel';
import MyUploadsSection from './components/MyUploadsSection';
import LockedScreen from './components/LockedScreen';
import { Toaster } from '@/components/ui/sonner';
import { useUnlistedAccess } from './hooks/useUnlistedAccess';

type Step = 'upload' | 'mark' | 'process' | 'download';

export interface WatermarkRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

function App() {
  const { isUnlocked, isChecking } = useUnlistedAccess();
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedVideoId, setUploadedVideoId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [watermarkRegion, setWatermarkRegion] = useState<WatermarkRegion | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Create object URL for video preview
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  const handleUploadComplete = (videoId: string) => {
    setUploadedVideoId(videoId);
    setIsUploading(false);
    setCurrentStep('mark');
  };

  const handleWatermarkConfirm = () => {
    if (watermarkRegion && uploadedVideoId) {
      setCurrentStep('process');
    }
  };

  const handleProcessingComplete = () => {
    setCurrentStep('download');
  };

  const handleCancelUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleReset = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setCurrentStep('upload');
    setSelectedFile(null);
    setUploadedVideoId(null);
    setUploadProgress(0);
    setIsUploading(false);
    setWatermarkRegion(null);
    setVideoUrl(null);
  };

  // Show loading while checking access
  if (isChecking) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Show locked screen if not unlocked
  if (!isUnlocked) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LockedScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppLayout>
        <div className="min-h-screen">
          <WorkflowHeader currentStep={currentStep} />
          
          <main className="container mx-auto px-4 py-8 max-w-6xl">
            {currentStep === 'upload' && (
              <div className="space-y-8 animate-fade-in">
                <VideoFilePicker
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  onStartUpload={() => setIsUploading(true)}
                  disabled={isUploading}
                />
                
                {isUploading && selectedFile && (
                  <UploadProgressCard
                    fileName={selectedFile.name}
                    progress={uploadProgress}
                    onProgressUpdate={setUploadProgress}
                    file={selectedFile}
                    onComplete={handleUploadComplete}
                    onCancel={handleCancelUpload}
                  />
                )}

                <MyUploadsSection onVideoSelect={(videoId) => {
                  setUploadedVideoId(videoId);
                  setCurrentStep('mark');
                }} />
              </div>
            )}

            {currentStep === 'mark' && uploadedVideoId && videoUrl && (
              <div className="space-y-6 animate-fade-in">
                <VideoWatermarkSelector
                  videoUrl={videoUrl}
                  onRegionChange={setWatermarkRegion}
                  region={watermarkRegion}
                />
                
                <WatermarkToolsPanel
                  region={watermarkRegion}
                  onRegionChange={setWatermarkRegion}
                  onConfirm={handleWatermarkConfirm}
                  onReset={() => setWatermarkRegion(null)}
                  onBack={handleReset}
                  disabled={!watermarkRegion}
                />
              </div>
            )}

            {currentStep === 'process' && uploadedVideoId && watermarkRegion && (
              <ProcessingScreen
                videoId={uploadedVideoId}
                watermarkRegion={watermarkRegion}
                onComplete={handleProcessingComplete}
                onRetry={() => setCurrentStep('mark')}
              />
            )}

            {currentStep === 'download' && uploadedVideoId && (
              <DownloadPanel
                videoId={uploadedVideoId}
                onStartNew={handleReset}
              />
            )}
          </main>
        </div>
        <Toaster />
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;
