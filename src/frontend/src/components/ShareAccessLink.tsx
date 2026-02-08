import { useState } from 'react';
import { Copy, Check, Share2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useUnlistedAccess } from '../hooks/useUnlistedAccess';

export default function ShareAccessLink() {
  const [copied, setCopied] = useState(false);
  const { getAccessSecret } = useUnlistedAccess();

  const secret = getAccessSecret();
  const shareUrl = secret 
    ? `${window.location.origin}${window.location.pathname}#${secret}`
    : '';

  const handleCopy = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Access link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  if (!secret) {
    return (
      <Alert className="bg-accent/50 border-accent">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No access secret available. Please open a valid access link first.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Share2 className="w-5 h-5" />
          Share Access Link
        </CardTitle>
        <CardDescription>
          Copy this link to share access with others
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={shareUrl}
            readOnly
            className="font-mono text-sm"
          />
          <Button
            onClick={handleCopy}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Anyone with this link can access and use the watermark removal tool.
        </p>
      </CardContent>
    </Card>
  );
}
