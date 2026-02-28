import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { X, Flashlight, RefreshCw, AlertCircle } from "lucide-react";
import { RecordButton } from "../components/RecordButton";
import { StatusChip } from "../components/StatusChip";
import { motion } from "motion/react";

export function CameraRecord() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [jointAngle, setJointAngle] = useState(45);
  const [alignmentStatus, setAlignmentStatus] = useState<
    "aligned" | "compensatory" | "warning"
  >("aligned");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 0.1);
        // Simulate changing joint angle
        setJointAngle((prev) => {
          const newAngle = prev + (Math.random() - 0.5) * 10;
          return Math.max(20, Math.min(120, newAngle));
        });
        // Simulate alignment detection
        const random = Math.random();
        if (random > 0.8) {
          setAlignmentStatus("compensatory");
        } else if (random > 0.6) {
          setAlignmentStatus("warning");
        } else {
          setAlignmentStatus("aligned");
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (recordingTime >= 15) {
      setIsRecording(false);
      setTimeout(() => navigate("/preview"), 500);
    }
  }, [recordingTime, navigate]);

  const handleRecord = () => {
    if (!isRecording && recordingTime === 0) {
      setIsRecording(true);
    } else if (isRecording) {
      setIsRecording(false);
      navigate("/preview");
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Camera View (simulated with gradient) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
        {/* Simulated camera feed placeholder */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-white/30 text-center">
            <p className="text-sm mb-2">Camera Feed</p>
            <p className="text-xs">(Simulated)</p>
          </div>
        </div>
      </div>

      {/* Joint Overlay Graphics */}
      {isRecording && (
        <>
          {/* Joint Point */}
          <motion.div
            className="absolute w-4 h-4 bg-accent rounded-full border-2 border-white"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Angle Arc */}
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            width="200"
            height="200"
          >
            <path
              d="M 100 100 L 100 30 A 70 70 0 0 1 150 150 Z"
              fill="rgba(8, 145, 178, 0.2)"
              stroke="#0891b2"
              strokeWidth="2"
            />
          </svg>

          {/* Angle Value Display */}
          <motion.div
            className="absolute left-1/2 top-1/3 -translate-x-1/2 bg-black/60 backdrop-blur px-4 py-2 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-2xl font-semibold text-white">
              {Math.round(jointAngle)}°
            </p>
          </motion.div>
        </>
      )}

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 pt-12 px-6 z-10">
        <div className="flex items-start justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="flex flex-col items-end gap-3">
            {isRecording && (
              <StatusChip status={alignmentStatus} />
            )}
            <button className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center">
              <Flashlight className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Center Guidance */}
      {!isRecording && recordingTime === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-1/4 left-0 right-0 px-6 text-center"
        >
          <div className="bg-black/60 backdrop-blur rounded-2xl p-6 max-w-sm mx-auto">
            <AlertCircle className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Position Yourself
            </h3>
            <p className="text-sm text-white/80">
              Stand in the frame with your full body visible. Tap the button to
              start recording.
            </p>
          </div>
        </motion.div>
      )}

      {/* Timer Display */}
      {isRecording && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 bg-destructive px-4 py-2 rounded-full"
        >
          <p className="text-white font-semibold tabular-nums">
            {recordingTime.toFixed(1)}s / 15.0s
          </p>
        </motion.div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-12 left-0 right-0 px-6">
        <div className="flex items-center justify-center gap-8">
          <RecordButton isRecording={isRecording} onPress={handleRecord} />
        </div>

        {!isRecording && recordingTime === 0 && (
          <p className="text-center text-white/80 text-sm mt-6">
            Recording will be 5-15 seconds
          </p>
        )}
      </div>

      {/* Live Metrics (when recording) */}
      {isRecording && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-32 left-6 right-6"
        >
          <div className="flex gap-3">
            <div className="flex-1 bg-black/60 backdrop-blur rounded-xl p-3">
              <p className="text-xs text-white/60 mb-1">Min Angle</p>
              <p className="text-xl font-semibold text-white">
                {Math.round(Math.min(45, jointAngle))}°
              </p>
            </div>
            <div className="flex-1 bg-black/60 backdrop-blur rounded-xl p-3">
              <p className="text-xs text-white/60 mb-1">Max Angle</p>
              <p className="text-xl font-semibold text-white">
                {Math.round(Math.max(45, jointAngle))}°
              </p>
            </div>
            <div className="flex-1 bg-black/60 backdrop-blur rounded-xl p-3">
              <p className="text-xs text-white/60 mb-1">ROM</p>
              <p className="text-xl font-semibold text-white">
                {Math.round(Math.abs(jointAngle - 45))}°
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
