import { useNavigate } from "react-router";
import { X, Play, RotateCcw } from "lucide-react";
import { Button } from "../components/ui/button";

export function VideoPreview() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Video Preview (simulated) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Play className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <p className="text-white/60">Video Preview</p>
          <p className="text-sm text-white/40 mt-2">Tap to play</p>
        </div>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 pt-12 px-6 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/camera")}
            className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">Preview</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto space-y-3">
          <Button
            size="lg"
            className="w-full"
            onClick={() => navigate("/upload")}
          >
            Upload for Analysis
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
            onClick={() => navigate("/camera")}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Record Again
          </Button>
        </div>
      </div>
    </div>
  );
}
