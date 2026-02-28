import { useNavigate } from "react-router";
import { Plus, TrendingUp, Calendar, Award } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { BottomNav } from "../components/BottomNav";
import { MetricCard } from "../components/MetricCard";
import { StatusChip } from "../components/StatusChip";
import { mockAssessments, mockUser, trendData } from "../lib/mockData";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

export function Home() {
  const navigate = useNavigate();
  const latestAssessment = mockAssessments[0];
  const previousScore = mockAssessments[1]?.movementScore || 0;
  const scoreImprovement = latestAssessment.movementScore - previousScore;

  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-accent pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto">
          <p className="text-white/80 mb-1">Welcome back,</p>
          <h1 className="text-2xl font-semibold text-white mb-6">
            {mockUser.name}
          </h1>

          {/* Latest Score Card */}
          <Card className="bg-white/95 backdrop-blur p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Latest Assessment
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(latestAssessment.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <StatusChip
                status={
                  latestAssessment.compensationDetected ? "warning" : "aligned"
                }
              />
            </div>
            <div className="flex items-end gap-6">
              <div>
                <p className="text-5xl font-semibold text-foreground">
                  {latestAssessment.movementScore}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Movement Score
                </p>
              </div>
              <div className="flex-1 mb-2">
                {scoreImprovement > 0 && (
                  <div className="flex items-center gap-1 text-success">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      +{scoreImprovement} from last
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 max-w-md mx-auto space-y-6">
        {/* Quick Action */}
        <Button
          size="lg"
          className="w-full h-14"
          onClick={() => navigate("/assessment")}
        >
          <Plus className="w-5 h-5 mr-2" />
          New Assessment
        </Button>

        {/* Key Metrics */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Today's Metrics</h2>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              icon={TrendingUp}
              label="ROM"
              value={latestAssessment.rom}
              unit="°"
              variant="accent"
            />
            <MetricCard
              icon={Award}
              label="Max Angle"
              value={latestAssessment.maxAngle}
              unit="°"
              variant="success"
            />
          </div>
        </div>

        {/* Trend Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Progress Trend</h3>
            <button
              onClick={() => navigate("/history")}
              className="text-sm text-accent hover:underline"
            >
              View All
            </button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[60, 100]}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#0891b2"
                strokeWidth={3}
                dot={{ fill: "#0891b2", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Sessions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recent Sessions</h2>
            <button
              onClick={() => navigate("/history")}
              className="text-sm text-accent hover:underline"
            >
              See All
            </button>
          </div>
          <div className="space-y-3">
            {mockAssessments.slice(0, 3).map((assessment) => (
              <Card
                key={assessment.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/history/${assessment.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {new Date(assessment.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <p className="font-medium">{assessment.jointType}</p>
                    <p className="text-sm text-muted-foreground">
                      {assessment.taskType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold">
                      {assessment.movementScore}
                    </p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
