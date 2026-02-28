import { useNavigate } from "react-router";
import { Camera, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export function PermissionDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="w-10 h-10 text-warning" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Camera Access Required</h2>
          <p className="text-muted-foreground">
            Medical Movement Analysis needs camera access to record and analyze
            your movements.
          </p>
        </div>

        <Card className="p-6 bg-accent/5 border-accent/20 mb-6">
          <div className="flex gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">How to Enable Camera Access</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Go to your device Settings</li>
                <li>Find this app in the app list</li>
                <li>Enable Camera permission</li>
                <li>Return to the app and try again</li>
              </ol>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              // In a real app, this would open system settings
              alert("This would open system settings");
            }}
          >
            Open Settings
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => navigate("/home")}
          >
            Go Back
          </Button>
        </div>

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            Your privacy is important to us. Camera access is only used during
            assessment recording and videos are processed securely.
          </p>
        </div>
      </div>
    </div>
  );
}
