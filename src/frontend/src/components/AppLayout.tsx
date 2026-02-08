import { ReactNode } from 'react';
import { SiCaffeine } from 'react-icons/si';
import { Heart } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1">
        {children}
      </div>
      
      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
            <span>© 2026. Built with</span>
            <Heart className="w-4 h-4 fill-primary text-primary inline-block" />
            <span>using</span>
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium"
            >
              <SiCaffeine className="w-4 h-4" />
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
