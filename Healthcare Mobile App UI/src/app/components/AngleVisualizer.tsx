import { motion } from "motion/react";

interface AngleVisualizerProps {
  angle: number;
  minAngle?: number;
  maxAngle?: number;
  size?: number;
  showLabel?: boolean;
}

export function AngleVisualizer({
  angle,
  minAngle,
  maxAngle,
  size = 120,
  showLabel = true,
}: AngleVisualizerProps) {
  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  // Convert angle to radians for visualization
  const angleRad = (angle * Math.PI) / 180;

  // Calculate arc path
  const largeArcFlag = angle > 180 ? 1 : 0;
  const endX = centerX + radius * Math.cos(angleRad - Math.PI / 2);
  const endY = centerY + radius * Math.sin(angleRad - Math.PI / 2);

  return (
    <div className="relative inline-block">
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted/20"
        />

        {/* Angle arc */}
        <motion.path
          d={`M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-accent"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Center point */}
        <circle cx={centerX} cy={centerY} r="4" className="fill-accent" />

        {/* Start line */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX}
          y2={centerY - radius}
          stroke="currentColor"
          strokeWidth="2"
          className="text-foreground/40"
        />

        {/* End line */}
        <line
          x1={centerX}
          y1={centerY}
          x2={endX}
          y2={endY}
          stroke="currentColor"
          strokeWidth="2"
          className="text-accent"
        />
      </svg>

      {/* Angle label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-semibold">{Math.round(angle)}°</p>
          </div>
        </div>
      )}

      {/* Min/Max indicators */}
      {(minAngle !== undefined || maxAngle !== undefined) && (
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
          {minAngle !== undefined && <span>Min: {minAngle}°</span>}
          {maxAngle !== undefined && <span>Max: {maxAngle}°</span>}
        </div>
      )}
    </div>
  );
}
