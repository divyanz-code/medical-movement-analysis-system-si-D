import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Calendar, Clock, Download, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { MetricCard } from "../components/MetricCard";
import { StatusChip } from "../components/StatusChip";
import { mockAssessments } from "../lib/mockData";

export function HistoryDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const assessment = mockAssessments.find((a) => a.id === id) || mockAssessments[0];
  const assessmentIndex = mockAssessments.findIndex((a) => a.id === id);
  const previousAssessment = mockAssessments[assessmentIndex + 1];

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-4 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Assessment Details</h1>
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
        {/* Session Info */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                {assessment.jointType}
              </h2>
              <p className="text-lg text-muted-foreground">
                {assessment.taskType}
              </p>
            </div>
            <StatusChip
              status={assessment.compensationDetected ? "warning" : "aligned"}
            />
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {new Date(assessment.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {new Date(assessment.date).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
        </Card>

        {/* Score Overview */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Movement Score</h3>
          <div className="flex items-end gap-6 mb-6">
            <div>
              <p className="text-5xl font-semibold">{assessment.movementScore}</p>
              <p className="text-sm text-muted-foreground mt-1">Current</p>
            </div>
            {previousAssessment && (
              <div className="mb-2">
                <p className="text-2xl font-medium text-muted-foreground">
                  {previousAssessment.movementScore}
                </p>
                <p className="text-xs text-muted-foreground">Previous</p>
              </div>
            )}
            {previousAssessment && (
              <div className="mb-2">
                <div
                  className={`text-sm font-medium ${
                    assessment.movementScore > previousAssessment.movementScore
                      ? "text-success"
                      : "text-destructive"
                  }`}
                >
                  {assessment.movementScore > previousAssessment.movementScore
                    ? "+"
                    : ""}
                  {assessment.movementScore - previousAssessment.movementScore}
                </div>
                <p className="text-xs text-muted-foreground">Change</p>
              </div>
            )}
          </div>

          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-success rounded-full transition-all"
              style={{ width: `${assessment.movementScore}%` }}
            />
          </div>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={Calendar}
            label="Min Angle"
            value={assessment.minAngle}
            unit="°"
          />
          <MetricCard
            icon={Calendar}
            label="Max Angle"
            value={assessment.maxAngle}
            unit="°"
          />
          <div className="col-span-2">
            <MetricCard
              icon={Calendar}
              label="Range of Motion"
              value={assessment.rom}
              unit="°"
              variant="accent"
            />
          </div>
        </div>

        {/* Notes */}
        {assessment.notes && (
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Clinical Notes</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {assessment.notes}
            </p>
          </Card>
        )}

        {/* Comparison */}
        {previousAssessment && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Comparison with Previous</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ROM</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{previousAssessment.rom}°</span>
                  <span className="text-sm">→</span>
                  <span className="text-sm font-semibold">{assessment.rom}°</span>
                  <span
                    className={`text-xs font-medium ${
                      assessment.rom > previousAssessment.rom
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {assessment.rom > previousAssessment.rom ? "+" : ""}
                    {assessment.rom - previousAssessment.rom}°
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Max Angle</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{previousAssessment.maxAngle}°</span>
                  <span className="text-sm">→</span>
                  <span className="text-sm font-semibold">
                    {assessment.maxAngle}°
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      assessment.maxAngle > previousAssessment.maxAngle
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {assessment.maxAngle > previousAssessment.maxAngle ? "+" : ""}
                    {assessment.maxAngle - previousAssessment.maxAngle}°
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="space-y-3 pb-6">
          <Button
            size="lg"
            className="w-full"
            onClick={() => navigate("/assessment")}
          >
            Start Similar Assessment
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => navigate("/history")}
          >
            Back to History
          </Button>
        </div>
      </div>
    </div>
  );
}
