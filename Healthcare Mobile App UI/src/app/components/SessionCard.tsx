import { Calendar, TrendingUp } from "lucide-react";
import { Card } from "./ui/card";
import { StatusChip } from "./StatusChip";
import { Assessment } from "../lib/types";

interface SessionCardProps {
  assessment: Assessment;
  onClick?: () => void;
  showComparison?: boolean;
  previousScore?: number;
}

export function SessionCard({
  assessment,
  onClick,
  showComparison = false,
  previousScore,
}: SessionCardProps) {
  const scoreChange =
    showComparison && previousScore
      ? assessment.movementScore - previousScore
      : null;

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-all"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* Date Circle */}
        <div className="flex-shrink-0 w-14 h-14 bg-accent/10 rounded-full flex flex-col items-center justify-center">
          <p className="text-xl font-semibold text-accent">
            {new Date(assessment.date).getDate()}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(assessment.date).toLocaleString("en-US", {
              month: "short",
            })}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold truncate">{assessment.jointType}</h3>
              <p className="text-sm text-muted-foreground">
                {assessment.taskType}
              </p>
            </div>
            <StatusChip
              status={assessment.compensationDetected ? "warning" : "aligned"}
            />
          </div>

          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Score</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">
                  {assessment.movementScore}
                </p>
                {scoreChange !== null && (
                  <span
                    className={`text-xs font-medium flex items-center gap-1 ${
                      scoreChange > 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    <TrendingUp
                      className={`w-3 h-3 ${
                        scoreChange < 0 ? "rotate-180" : ""
                      }`}
                    />
                    {Math.abs(scoreChange)}
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ROM</p>
              <p className="text-lg font-semibold">{assessment.rom}°</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
