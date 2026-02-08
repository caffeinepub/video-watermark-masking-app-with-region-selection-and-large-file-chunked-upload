import { CheckCircle2, Upload, Scissors, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ShareAccessLink from './ShareAccessLink';

interface WorkflowHeaderProps {
  currentStep: 'upload' | 'mark' | 'process' | 'download';
}

export default function WorkflowHeader({ currentStep }: WorkflowHeaderProps) {
  const steps = [
    { id: 'upload', label: 'Upload Video', icon: Upload },
    { id: 'mark', label: 'Mark Watermark', icon: Scissors },
    { id: 'process', label: 'Process', icon: CheckCircle2 },
    { id: 'download', label: 'Download', icon: Download }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <img 
            src="/assets/generated/watermark-erased-logo.dim_512x512.png" 
            alt="Watermark Eraser"
            className="w-16 h-16 object-contain"
          />
          <div className="ml-4">
            <h1 className="text-3xl font-bold text-foreground">Watermark Eraser</h1>
            <p className="text-sm text-muted-foreground mt-1">Remove watermarks with AI-powered reconstruction</p>
          </div>
        </div>

        <div className="mb-6 max-w-2xl mx-auto">
          <ShareAccessLink />
        </div>

        <Alert className="mb-6 bg-accent/50 border-accent">
          <AlertDescription className="text-sm text-center">
            <strong>Note:</strong> Results are best-effort AI reconstruction. The output may not be pixel-identical to the original content behind the watermark.
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-center gap-4 max-w-3xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all
                    ${isActive ? 'bg-primary text-primary-foreground shadow-warm scale-110' : ''}
                    ${isCompleted ? 'bg-primary/20 text-primary' : ''}
                    ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`
                    text-xs mt-2 font-medium text-center
                    ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                  `}>
                    {step.label}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`
                    h-0.5 flex-1 mx-2 transition-colors
                    ${isCompleted ? 'bg-primary' : 'bg-border'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
