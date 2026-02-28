import { useState } from "react";
import { ArrowLeft, Activity, TrendingUp, Award, Camera, Calendar } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { MetricCard } from "../components/MetricCard";
import { StatusChip } from "../components/StatusChip";
import { RecordButton } from "../components/RecordButton";
import { AngleVisualizer } from "../components/AngleVisualizer";
import { EmptyState } from "../components/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export function DesignSystem() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-4 py-4 flex items-center gap-3 z-10">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">Design System</h1>
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">
        <Tabs defaultValue="colors">
          <TabsList className="mb-6">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Color System</h2>
              <p className="text-muted-foreground mb-6">
                Clinical and trustworthy color palette designed for medical applications
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Primary Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-2">
                      <div className="h-20 bg-primary rounded-lg border border-border" />
                      <p className="text-sm font-medium">Primary</p>
                      <p className="text-xs text-muted-foreground">Deep Navy</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-20 bg-secondary rounded-lg border border-border" />
                      <p className="text-sm font-medium">Secondary</p>
                      <p className="text-xs text-muted-foreground">Light Gray</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-20 bg-accent rounded-lg border border-border" />
                      <p className="text-sm font-medium">Accent</p>
                      <p className="text-xs text-muted-foreground">Clinical Teal</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-20 bg-muted rounded-lg border border-border" />
                      <p className="text-sm font-medium">Muted</p>
                      <p className="text-xs text-muted-foreground">Cool Gray</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Status Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <div className="h-20 bg-success rounded-lg border border-border" />
                      <p className="text-sm font-medium">Success</p>
                      <p className="text-xs text-muted-foreground">Green</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-20 bg-warning rounded-lg border border-border" />
                      <p className="text-sm font-medium">Warning</p>
                      <p className="text-xs text-muted-foreground">Orange</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-20 bg-destructive rounded-lg border border-border" />
                      <p className="text-sm font-medium">Destructive</p>
                      <p className="text-xs text-muted-foreground">Red</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Core Components</h2>

              <div className="space-y-8">
                {/* Buttons */}
                <div>
                  <h3 className="font-semibold mb-4">Buttons</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button>Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="destructive">Destructive Button</Button>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                {/* Status Chips */}
                <div>
                  <h3 className="font-semibold mb-4">Status Chips</h3>
                  <div className="flex flex-wrap gap-3">
                    <StatusChip status="aligned" />
                    <StatusChip status="compensatory" />
                    <StatusChip status="warning" />
                    <StatusChip status="success" />
                    <StatusChip status="processing" />
                  </div>
                </div>

                {/* Cards */}
                <div>
                  <h3 className="font-semibold mb-4">Cards</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-6">
                      <h4 className="font-semibold mb-2">Basic Card</h4>
                      <p className="text-sm text-muted-foreground">
                        Standard card component with padding and border
                      </p>
                    </Card>
                    <Card className="p-6 bg-accent/5 border-accent/20">
                      <h4 className="font-semibold mb-2">Accent Card</h4>
                      <p className="text-sm text-muted-foreground">
                        Card with accent background and border
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Medical Components Tab */}
          <TabsContent value="medical" className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Medical Components</h2>
              <p className="text-muted-foreground mb-6">
                Specialized components for movement analysis and assessment
              </p>

              <div className="space-y-8">
                {/* Metric Cards */}
                <div>
                  <h3 className="font-semibold mb-4">Metric Cards</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <MetricCard
                      icon={Activity}
                      label="Movement Score"
                      value={87}
                      trend="up"
                      variant="default"
                    />
                    <MetricCard
                      icon={TrendingUp}
                      label="Range of Motion"
                      value={106}
                      unit="°"
                      variant="accent"
                    />
                    <MetricCard
                      icon={Award}
                      label="Max Angle"
                      value={118}
                      unit="°"
                      variant="success"
                    />
                    <MetricCard
                      icon={Activity}
                      label="Compensation"
                      value="Detected"
                      variant="warning"
                    />
                  </div>
                </div>

                {/* Record Button */}
                <div>
                  <h3 className="font-semibold mb-4">Record Button</h3>
                  <div className="bg-black/90 rounded-xl p-8 flex items-center justify-center">
                    <RecordButton
                      isRecording={isRecording}
                      onPress={() => setIsRecording(!isRecording)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    {isRecording ? "Recording..." : "Tap to start recording"}
                  </p>
                </div>

                {/* Angle Visualizer */}
                <div>
                  <h3 className="font-semibold mb-4">Angle Visualizer</h3>
                  <div className="flex flex-wrap gap-8 items-start justify-center p-6 bg-secondary rounded-xl">
                    <div>
                      <AngleVisualizer angle={45} size={120} />
                      <p className="text-sm text-center mt-3 text-muted-foreground">
                        45° Angle
                      </p>
                    </div>
                    <div>
                      <AngleVisualizer angle={90} minAngle={20} maxAngle={120} size={120} />
                      <p className="text-sm text-center mt-8 text-muted-foreground">
                        With Min/Max
                      </p>
                    </div>
                    <div>
                      <AngleVisualizer angle={135} size={120} />
                      <p className="text-sm text-center mt-3 text-muted-foreground">
                        135° Angle
                      </p>
                    </div>
                  </div>
                </div>

                {/* Empty State */}
                <div>
                  <h3 className="font-semibold mb-4">Empty State</h3>
                  <Card className="p-6">
                    <EmptyState
                      icon={Calendar}
                      title="No Assessments Yet"
                      description="Start your first movement assessment to track your progress"
                      actionLabel="New Assessment"
                      onAction={() => {}}
                    />
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
