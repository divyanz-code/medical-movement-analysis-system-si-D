import { WifiOff } from "lucide-react";
import { Button } from "../components/ui/button";

export function Offline() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-3">No Internet Connection</h2>
        <p className="text-muted-foreground mb-8">
          Please check your network settings and try again. Your assessments
          will sync when you're back online.
        </p>
        <Button size="lg" className="w-full" onClick={handleRetry}>
          Try Again
        </Button>
        <p className="text-sm text-muted-foreground mt-6">
          You can still view your saved assessments offline
        </p>
      </div>
    </div>
  );
}
