import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Download, Share2, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { MetricCard } from "../components/MetricCard";
import { StatusChip } from "../components/StatusChip";
import { mockAssessments } from "../lib/mockData";
import { motion } from "motion/react";

export function Results() {
  const navigate = useNavigate();
  const { id } = useParams();
  const assessment = mockAssessments.find((a) => a.id === id) || mockAssessments[0];

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-4 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/home")}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Assessment Results</h1>
            <p className="text-xs text-muted-foreground">
              {new Date(assessment.date).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-md mx-auto space-y-6">
        {/* Score Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Card className="p-8 text-center bg-gradient-to-br from-accent/5 to-success/5 border-accent/20">
            <StatusChip
              status={assessment.compensationDetected ? "warning" : "aligned"}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="my-6"
            >
              <div className="relative inline-block">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted/20"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(assessment.movementScore / 100) * 440} 440`}
                    className="text-accent"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <p className="text-5xl font-semibold">
                      {assessment.movementScore}
                    </p>
                    <p className="text-sm text-muted-foreground">Score</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <h2 className="text-2xl font-semibold mb-2">
              {assessment.movementScore >= 85
                ? "Excellent Movement"
                : assessment.movementScore >= 70
                ? "Good Progress"
                : "Needs Improvement"}
            </h2>
            <p className="text-muted-foreground">
              {assessment.jointType} • {assessment.taskType}
            </p>
          </Card>
        </motion.div>

        {/* Key Metrics */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              icon={TrendingUp}
              label="Min Angle"
              value={assessment.minAngle}
              unit="°"
              variant="default"
            />
            <MetricCard
              icon={TrendingUp}
              label="Max Angle"
              value={assessment.maxAngle}
              unit="°"
              variant="default"
            />
          </div>
          <div className="mt-3">
            <MetricCard
              icon={TrendingUp}
              label="Range of Motion (ROM)"
              value={assessment.rom}
              unit="°"
              variant="accent"
              trend="up"
            />
          </div>
        </div>

        {/* Compensation Warning */}
        {assessment.compensationDetected && assessment.notes && (
          <Card className="p-4 border-warning/20 bg-warning/5">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-warning mb-1">
                  Compensation Detected
                </p>
                <p className="text-sm text-foreground">{assessment.notes}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Insights */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Movement Insights</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Fluidity</span>
                <span className="text-sm text-muted-foreground">
                  {assessment.movementScore >= 80 ? "Excellent" : "Good"}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-success rounded-full"
                  style={{ width: `${assessment.movementScore}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Control</span>
                <span className="text-sm text-muted-foreground">
                  {assessment.compensationDetected ? "Fair" : "Good"}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{
                    width: `${assessment.compensationDetected ? 65 : 85}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Symmetry</span>
                <span className="text-sm text-muted-foreground">Good</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-2 rounded-full w-3/4" />
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3 pb-6">
          <Button
            size="lg"
            className="w-full"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => navigate("/assessment")}
          >
            New Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
