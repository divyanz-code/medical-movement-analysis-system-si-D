import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { motion } from "motion/react";

export function UploadProgress() {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [stage, setStage] = useState<"uploading" | "processing" | "complete">(
    "uploading"
  );

  useEffect(() => {
    // Simulate upload
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setStage("processing");
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(uploadInterval);
  }, []);

  useEffect(() => {
    if (stage === "processing") {
      // Simulate analysis
      const analysisInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 100) {
            clearInterval(analysisInterval);
            setStage("complete");
            setTimeout(() => navigate("/results/1"), 1000);
            return 100;
          }
          return prev + 5;
        });
      }, 150);

      return () => clearInterval(analysisInterval);
    }
  }, [stage, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-8"
        >
          {stage === "uploading" && (
            <>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                Uploading Video...
              </h2>
              <p className="text-muted-foreground">
                Securely transferring your assessment
              </p>
            </>
          )}

          {stage === "processing" && (
            <>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                Analyzing Movement...
              </h2>
              <p className="text-muted-foreground">
                AI is processing your video and extracting metrics
              </p>
            </>
          )}

          {stage === "complete" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-8 h-8 text-success" />
              </motion.div>
              <h2 className="text-2xl font-semibold mb-2">
                Analysis Complete!
              </h2>
              <p className="text-muted-foreground">
                Redirecting to your results...
              </p>
            </>
          )}
        </motion.div>

        {/* Progress Bars */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Upload</span>
              <span className="text-sm text-muted-foreground">
                {uploadProgress}%
              </span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Analysis</span>
              <span className="text-sm text-muted-foreground">
                {analysisProgress}%
              </span>
            </div>
            <Progress value={analysisProgress} className="h-2" />
          </div>
        </div>

        {/* Processing Steps */}
        {stage === "processing" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-3"
          >
            {[
              "Detecting body landmarks",
              "Calculating joint angles",
              "Analyzing movement patterns",
              "Generating insights",
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.3 }}
                className="flex items-center gap-3 text-sm"
              >
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                <span className="text-muted-foreground">{step}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
