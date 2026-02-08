import { Lock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LockedScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full shadow-warm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Lock className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Access Restricted</CardTitle>
            <CardDescription className="mt-2">
              This application is private and requires a valid access link
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="bg-accent/50 border-accent">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              If you believe you should have access, please contact the application owner for a valid access link.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
