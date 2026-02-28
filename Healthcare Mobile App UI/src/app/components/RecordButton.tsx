import { motion } from "motion/react";
import { Circle } from "lucide-react";
import { useState } from "react";

interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
}

export function RecordButton({ isRecording, onPress }: RecordButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      onTapStart={() => setIsPressed(true)}
      onTap={() => {
        setIsPressed(false);
        onPress();
      }}
      onTapCancel={() => setIsPressed(false)}
      className="relative flex items-center justify-center"
      animate={{
        scale: isPressed ? 0.95 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Outer ring */}
      <div
        className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-colors ${
          isRecording ? "border-destructive" : "border-white"
        }`}
      >
        {/* Inner button */}
        <motion.div
          className={`rounded-full transition-colors ${
            isRecording ? "bg-destructive" : "bg-white"
          }`}
          animate={{
            width: isRecording ? 32 : 64,
            height: isRecording ? 32 : 64,
            borderRadius: isRecording ? 8 : 32,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </div>

      {/* Recording pulse animation */}
      {isRecording && (
        <motion.div
          className="absolute w-20 h-20 rounded-full border-4 border-destructive"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
    </motion.button>
  );
}
